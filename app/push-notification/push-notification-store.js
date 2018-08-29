// @flow
import { Platform } from 'react-native'
import {
  call,
  all,
  takeLatest,
  takeEvery,
  take,
  select,
  put,
  fork,
} from 'redux-saga/effects'
import { PAYLOAD_TYPE, MESSAGE_TYPE } from '../api/api-constants'
import { captureError } from '../services/error/error-handler'
import {
  getAgencyUrl,
  getAllConnection,
  getRemotePairwiseDidAndName,
  getUserOneTimeInfo,
  getAgencyVerificationKey,
  getHydrationState,
  getPoolConfig,
  getInvitations,
  getDeepLinkTokens,
  getPendingFetchAdditionalDataKey,
  getIsAppLocked,
  getSerializedClaimOffer,
} from '../store/store-selector'
import {
  PUSH_NOTIFICATION_PERMISSION,
  PUSH_NOTIFICATION_UPDATE_TOKEN,
  PUSH_NOTIFICATION_RECEIVED,
  FETCH_ADDITIONAL_DATA,
  FETCH_ADDITIONAL_DATA_ERROR,
  HYDRATE_PUSH_TOKEN,
  FETCH_ADDITIONAL_DATA_PENDING_KEYS,
  UPDATE_RELEVANT_PUSH_PAYLOAD_STORE_AND_REDIRECT,
  UPDATE_RELEVANT_PUSH_PAYLOAD_STORE,
} from './type-push-notification'

import type {
  CustomError,
  NotificationPayload,
  ReactNavigation,
} from '../common/type-common'
import type {
  AdditionalDataPayload,
  PushNotificationPermissionAction,
  PushNotificationUpdateTokenAction,
  PushNotificationReceivedAction,
  FetchAdditionalDataAction,
  AdditionalDataResponse,
  PushNotificationAction,
  PushNotificationStore,
  DownloadedNotification,
  ClaimOfferPushPayload,
  ClaimPushPayload,
  HydratePushTokenAction,
  updatePayloadToRelevantStoreAndRedirectAction,
  RedirectToRelevantScreen,
} from './type-push-notification'
import type { Connections } from '../connection/type-connection'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import {
  updatePushTokenVcx,
  downloadClaimOffer,
  downloadProofRequest,
  getHandleBySerializedConnection,
  serializeClaimOffer,
} from '../bridge/react-native-cxs/RNCxs'
import { HYDRATED } from '../store/type-config-store'
import { CONNECT_REGISTER_CREATE_AGENT_DONE } from '../store/user/type-user-store'
import uniqueId from 'react-native-unique-id'
import { RESET } from '../common/type-common'
import { ensureVcxInitSuccess } from '../store/config-store'
import type { Connection } from '../store/type-connection-store'
import type { CxsCredentialOfferResult } from '../bridge/react-native-cxs/type-cxs'
import type {
  ProofRequestPushPayload,
  AdditionalProofDataPayload,
} from '../proof-request/type-proof-request'
import { saveSerializedClaimOffer } from '../claim-offer/claim-offer-store'
import type { ClaimPushPayloadVcx } from '../claim/type-claim'
import { safeGet, safeSet } from '../services/storage'
import { PUSH_COM_METHOD } from '../common'
import type { NavigationParams, GenericObject } from '../common/type-common'

import { addPendingRedirection } from '../lock/lock-store'
import { authenticationRequestReceived } from '../authentication/authentication-store'
import { claimOfferReceived } from '../claim-offer/claim-offer-store'
import { proofRequestReceived } from '../proof-request/proof-request-store'
import { updateMessageStatus } from '../store/config-store'
import {
  claimOfferRoute,
  invitationRoute,
  proofRequestRoute,
  qrCodeScannerTabRoute,
  homeTabRoute,
} from '../common'
import type { Claim } from '../claim/type-claim'
import { claimReceivedVcx } from '../claim/claim-store'
import { NavigationActions } from 'react-navigation'
import type { SerializedClaimOffer } from './../claim-offer/type-claim-offer'

async function delay(ms): Promise<number> {
  return new Promise(res => setTimeout(res, ms))
}
const blackListedRoute = {}

const initialState = {
  isAllowed: false,
  notification: null,
  pushToken: null,
  isPristine: true,
  isFetching: false,
  error: null,
  pendingFetchAdditionalDataKey: null,
  navigateRoute: null,
}

export const pushNotificationPermissionAction = (isAllowed: boolean) => ({
  type: PUSH_NOTIFICATION_PERMISSION,
  isAllowed,
})

export const updatePushToken = (token: string) => ({
  type: PUSH_NOTIFICATION_UPDATE_TOKEN,
  token,
})

export function* onPushTokenUpdate(
  action: PushNotificationUpdateTokenAction
): Generator<*, *, *> {
  try {
    const pushToken = `FCM:${action.token}`
    const id = yield uniqueId()
    yield* ensureVcxInitSuccess()
    yield call(updatePushTokenVcx, { uniqueId: id, pushToken })
    yield* savePushTokenSaga(pushToken)
  } catch (e) {
    captureError(e)
  }
}

export function convertClaimOfferPushPayloadToAppClaimOffer(
  pushPayload: ClaimOfferPushPayload
): AdditionalDataPayload {
  /**
   * Below expression Converts this format
   * {
   *  name: ["Test"],
   *  height: ["170"]
   * }
   * TO
   * [
   *  {label: "name", data: "Test"},
   *  {label: "height", data: "170"},
   * ]
   */
  const revealedAttributes = Object.keys(pushPayload.claim).map(
    attributeName => ({
      label: attributeName,
      data: pushPayload.claim[attributeName][0],
    })
  )

  return {
    issuer: {
      name: pushPayload.issuer_name || pushPayload.remoteName,
      did: pushPayload.issuer_did,
    },
    data: {
      name: pushPayload.claim_name,
      version: pushPayload.version,
      revealedAttributes,
      claimDefinitionSchemaSequenceNumber: pushPayload.schema_seq_no,
    },
    payTokenValue: pushPayload.price,
  }
}

export function convertProofRequestPushPayloadToAppProofRequest(
  pushPayload: ProofRequestPushPayload
): AdditionalProofDataPayload {
  const { proof_request_data, remoteName, proofHandle } = pushPayload
  const { requested_attributes, name, version } = proof_request_data

  const requestedAttributes = Object.keys(requested_attributes).map(
    attributeKey => ({
      label: requested_attributes[attributeKey].name,
    })
  )

  return {
    data: {
      name,
      version,
      requestedAttributes,
    },
    requester: {
      name: remoteName,
    },
    originalProofRequestData: proof_request_data,
    proofHandle,
  }
}

export function convertClaimPushPayloadToAppClaim(
  pushPayload: ClaimPushPayload,
  uid: string,
  forDID: string
): Claim {
  return {
    ...pushPayload,
    messageId: pushPayload.claim_offer_id,
    remoteDid: pushPayload.from_did,
    uid,
    forDID,
  }
}

function* watchPushTokenUpdate(): any {
  yield takeLatest(PUSH_NOTIFICATION_UPDATE_TOKEN, onPushTokenUpdate)
}

export const pushNotificationReceived = (
  notification: DownloadedNotification
) => ({
  type: PUSH_NOTIFICATION_RECEIVED,
  notification,
})

export const fetchAdditionalData = (
  notificationPayload: NotificationPayload
) => ({
  type: FETCH_ADDITIONAL_DATA,
  notificationPayload,
})

export const fetchAdditionalDataError = (error: CustomError) => ({
  type: FETCH_ADDITIONAL_DATA_ERROR,
  error,
})

export const setFetchAdditionalDataPendingKeys = (
  uid: string,
  forDID: string
) => ({
  type: FETCH_ADDITIONAL_DATA_PENDING_KEYS,
  uid,
  forDID,
})

export function* fetchAdditionalDataSaga(
  action: FetchAdditionalDataAction
): Generator<*, *, *> {
  const { forDID, uid, type, senderLogoUrl } = action.notificationPayload
  if (forDID && uid) {
    const fetchDataAlreadyExists = yield select(
      getPendingFetchAdditionalDataKey
    )
    if (fetchDataAlreadyExists && fetchDataAlreadyExists[`${uid}-${forDID}`]) {
      return
    }
    yield put(setFetchAdditionalDataPendingKeys(uid, forDID))
  }
  yield* ensureVcxInitSuccess()

  if (!forDID) {
    yield put(
      fetchAdditionalDataError({
        code: 'OCS-001',
        message: 'Missing forDID in notification payload',
      })
    )
    return
  }

  const {
    remotePairwiseDID,
    remoteName,
    ...connection
  }: {
    remotePairwiseDID: string,
    remoteName: string,
  } & Connection = yield select(getRemotePairwiseDidAndName, forDID)

  if (!remotePairwiseDID || !connection.vcxSerializedConnection) {
    yield put(
      fetchAdditionalDataError({
        code: 'OCS-002',
        message: 'No pairwise connection found',
      })
    )

    return
  }

  const connectionHandle = yield call(
    getHandleBySerializedConnection,
    connection.vcxSerializedConnection
  )

  try {
    let additionalData:
      | ClaimOfferPushPayload
      | ProofRequestPushPayload
      | ClaimPushPayload
      | ClaimPushPayloadVcx
      | null = null

    if (type === MESSAGE_TYPE.CLAIM_OFFER) {
      const vcxSerializedClaimOffer: SerializedClaimOffer | null = yield select(
        getSerializedClaimOffer,
        forDID,
        uid
      )
      if (!vcxSerializedClaimOffer) {
        const {
          claimHandle,
          claimOffer,
        }: CxsCredentialOfferResult = yield call(
          downloadClaimOffer,
          connectionHandle,
          uid,
          uid
        )
        additionalData = claimOffer
        yield fork(saveSerializedClaimOffer, claimHandle, forDID, uid)
      }
    }

    if (type === MESSAGE_TYPE.CLAIM) {
      // as per vcx apis we are not downloading claim
      // we will update state of existing claim offer instance
      // and vcx will internally download claim and store inside wallet
      additionalData = {
        connectionHandle,
      }
    }

    if (type === MESSAGE_TYPE.PROOF_REQUEST) {
      additionalData = yield call(
        downloadProofRequest,
        uid,
        connectionHandle,
        uid
      )
    }

    if (!additionalData) {
      // we did not get any data or either push notification type is not supported
      return
    }

    yield put(
      pushNotificationReceived({
        type,
        additionalData: {
          ...additionalData,
          remoteName,
        },
        uid,
        senderLogoUrl,
        remotePairwiseDID,
        forDID,
      })
    )
  } catch (e) {
    yield put(
      fetchAdditionalDataError({
        code: 'OCS-000',
        message: 'Invalid additional data',
      })
    )
  }
}

export const updatePayloadToRelevantStoreAndRedirect = (
  notification: DownloadedNotification
) => ({
  type: UPDATE_RELEVANT_PUSH_PAYLOAD_STORE_AND_REDIRECT,
  notification,
})

export const updatePayloadToRelevantStore = (
  notification: DownloadedNotification
) => ({
  type: UPDATE_RELEVANT_PUSH_PAYLOAD_STORE,
  notification,
})

export const goToUIScreen = (
  uiType: string,
  uid: string,
  navigation: $PropertyType<ReactNavigation, 'navigation'>
) => ({
  type: 'GO_TO_UI_SCREEN',
  uiType,
  uid,
  navigation,
})

function* watchUpdateRelevantPushPayloadStoreAndRedirect(): any {
  yield takeEvery(UPDATE_RELEVANT_PUSH_PAYLOAD_STORE_AND_REDIRECT, function*({
    notification,
  }: updatePayloadToRelevantStoreAndRedirectAction) {
    yield* updatePayloadToRelevantStoreSaga(notification)
    yield* redirectToRelevantScreen({ ...notification, uiType: null })
    const { forDID: pairwiseDID, uid } = notification
    if (notification.type === MESSAGE_TYPE.PROOF_REQUEST) {
      yield* updateMessageStatus([{ pairwiseDID, uids: [uid] }])
    }
  })
}

export function* watchGoToUIScreen(): any {
  yield takeEvery('GO_TO_UI_SCREEN', redirectToRelevantScreen)
}

export function* updatePayloadToRelevantStoreSaga(
  message: DownloadedNotification
): Generator<*, *, *> {
  const {
    type,
    additionalData,
    uid,
    senderLogoUrl,
    remotePairwiseDID,
    forDID,
  } = message
  if (type) {
    switch (type) {
      case MESSAGE_TYPE.CLAIM_OFFER:
        yield put(
          claimOfferReceived(
            convertClaimOfferPushPayloadToAppClaimOffer(additionalData),
            {
              uid,
              senderLogoUrl,
              remotePairwiseDID,
            }
          )
        )

        break
      case MESSAGE_TYPE.PROOF_REQUEST:
        yield put(
          proofRequestReceived(
            convertProofRequestPushPayloadToAppProofRequest(additionalData),
            {
              uid,
              senderLogoUrl,
              remotePairwiseDID,
            }
          )
        )
        break
      case MESSAGE_TYPE.CLAIM:
        yield put(
          claimReceivedVcx({
            connectionHandle: additionalData.connectionHandle,
            uid,
            type,
            forDID,
            remotePairwiseDID,
          })
        )
        break
    }
  }
}

function* redirectToRelevantScreen({
  uiType,
  type,
  uid,
}: RedirectToRelevantScreen) {
  if (uiType || type)
    switch (uiType || type) {
      case 'CLAIM_OFFER_RECEIVED':
        //TODO fix the scenario where claim-offer is not added to pending redirection when app is unlocked
        //Redirect to claimOffer after 1 sec because after unlocking the app
        //it redirects to home screen
        //If we don't wait and redirect to claimOffer immediately , then
        //sometimes claim offer screen disappears as home screen redirection will happen
        //after it
        // yield call(delay, 1000)
        yield call(delay, 1000)

        yield handleRedirection(claimOfferRoute, {
          uid,
        })

        break

      case MESSAGE_TYPE.CLAIM_OFFER:
        yield call(delay, 1000)
        yield handleRedirection(claimOfferRoute, {
          uid,
        })

        break

      case MESSAGE_TYPE.PROOF_REQUEST:
        yield handleRedirection(proofRequestRoute, {
          uid,
        })
        break

      case 'PROOF_REQUEST_RECEIVED':
        yield handleRedirection(proofRequestRoute, {
          uid,
        })
        break
    }
}

function* handleRedirection(routeName: string, params: NavigationParams): any {
  const isAppLocked = yield select(getIsAppLocked)
  if (isAppLocked)
    yield put(
      addPendingRedirection([
        { routeName: homeTabRoute },
        { routeName, params },
      ])
    )
  else yield put(navigateToRoutePN(routeName, params))
}

export const navigateToRoutePN = (
  routeName: string,
  params: GenericObject
) => ({
  type: 'NAVIGATE_TO_ROUTE',
  routeName,
  params,
})

export const clearNavigateToRoutePN = () => ({
  type: 'CLEAR_NAVIGATE_TO_ROUTE',
})

function* watchFetchAdditionalData(): any {
  yield takeEvery(FETCH_ADDITIONAL_DATA, fetchAdditionalDataSaga)
}

export const hydratePushToken = (token: string): HydratePushTokenAction => ({
  type: HYDRATE_PUSH_TOKEN,
  token,
})

export function* hydratePushTokenSaga(): Generator<*, *, *> {
  try {
    const token = yield call(safeGet, PUSH_COM_METHOD)
    if (token) {
      yield put(hydratePushToken(token))
    }
  } catch (e) {
    console.error(`hydratePushTokenSaga: ${e}`)
  }
}

export function* savePushTokenSaga(pushToken: string): Generator<*, *, *> {
  try {
    yield call(safeSet, PUSH_COM_METHOD, pushToken)
  } catch (e) {
    // Need to figure out what should be done if storage fails
    console.error(`savePushTokenSaga: ${e}`)
  }
}

export function* watchPushNotification(): any {
  yield all([
    watchPushTokenUpdate(),
    watchFetchAdditionalData(),
    watchGoToUIScreen(),
    watchUpdateRelevantPushPayloadStoreAndRedirect(),
  ])
}

export default function pushNotification(
  state: PushNotificationStore = initialState,
  action: PushNotificationAction
) {
  switch (action.type) {
    case PUSH_NOTIFICATION_PERMISSION:
      return {
        ...state,
        isAllowed: action.isAllowed,
      }
    case HYDRATE_PUSH_TOKEN:
    case PUSH_NOTIFICATION_UPDATE_TOKEN:
      return {
        ...state,
        pushToken: action.token,
        isAllowed: true,
      }
    case FETCH_ADDITIONAL_DATA:
      return {
        ...state,
        isPristine: false,
        isFetching: true,
      }
    case FETCH_ADDITIONAL_DATA_ERROR:
      return {
        ...state,
        isPristine: false,
        isFetching: false,
        error: action.error,
      }
    case PUSH_NOTIFICATION_RECEIVED:
      return {
        ...state,
        notification: action.notification,
      }
    case FETCH_ADDITIONAL_DATA_PENDING_KEYS:
      return {
        ...state,
        pendingFetchAdditionalDataKey: {
          ...state.pendingFetchAdditionalDataKey,
          [`${action.uid}-${action.forDID}`]: true,
        },
      }
    case RESET:
      return {
        ...state,
        notification: null,
        error: null,
      }
    case 'NAVIGATE_TO_ROUTE':
      return {
        ...state,
        navigateRoute: {
          routeName: action.routeName,
          params: action.params,
        },
      }
    case 'CLEAR_NAVIGATE_TO_ROUTE':
      return {
        ...state,
        navigateRoute: null,
      }
    default:
      return state
  }
}

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
  getUseVcx,
  getInvitations,
  getDeepLinkTokens,
  getPendingFetchAdditionalDataKey,
} from '../store/store-selector'
import {
  PUSH_NOTIFICATION_PERMISSION,
  PUSH_NOTIFICATION_UPDATE_TOKEN,
  PUSH_NOTIFICATION_RECEIVED,
  FETCH_ADDITIONAL_DATA,
  FETCH_ADDITIONAL_DATA_ERROR,
  HYDRATE_PUSH_TOKEN,
  FETCH_ADDITIONAL_DATA_PENDING_KEYS,
} from './type-push-notification'

import type { CustomError, NotificationPayload } from '../common/type-common'
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
} from './type-push-notification'
import type { Connections } from '../connection/type-connection'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import {
  updatePushToken as updatePushTokenApi,
  getMessage,
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
import type { ProofRequestPushPayload } from '../proof-request/type-proof-request'
import { saveSerializedClaimOffer } from '../claim-offer/claim-offer-store'
import type { ClaimPushPayloadVcx } from '../claim/type-claim'
import { safeGet, safeSet } from '../services/storage'
import { PUSH_COM_METHOD } from '../common'

const initialState = {
  isAllowed: false,
  notification: null,
  pushToken: null,
  isPristine: true,
  isFetching: false,
  error: null,
  pendingFetchAdditionalDataKey: null,
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
  yield* ensureVcxInitSuccess()
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
      const { claimHandle, claimOffer }: CxsCredentialOfferResult = yield call(
        downloadClaimOffer,
        connectionHandle,
        uid,
        uid
      )
      additionalData = claimOffer
      yield fork(saveSerializedClaimOffer, claimHandle, forDID, uid)
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
  yield all([watchPushTokenUpdate(), watchFetchAdditionalData()])
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
    default:
      return state
  }
}

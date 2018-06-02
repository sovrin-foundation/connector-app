// @flow

import { Platform } from 'react-native'
import {
  call,
  all,
  takeLatest,
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
} from '../store/store-selector'
import {
  PUSH_NOTIFICATION_PERMISSION,
  PUSH_NOTIFICATION_UPDATE_TOKEN,
  PUSH_NOTIFICATION_RECEIVED,
  FETCH_ADDITIONAL_DATA,
  FETCH_ADDITIONAL_DATA_ERROR,
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

// TODO:PS: handle other/multiple Push Notification while
// one Push Notification is already downloading
const initialState = {
  isAllowed: false,
  notification: null,
  pushToken: null,
  isPristine: true,
  isFetching: false,
  error: null,
}

export const pushNotificationPermissionAction = (isAllowed: boolean) => ({
  type: PUSH_NOTIFICATION_PERMISSION,
  isAllowed,
})

export const updatePushToken = (token: string) => ({
  type: PUSH_NOTIFICATION_UPDATE_TOKEN,
  token,
})

export function* onPushTokenUpdateVcx(
  action: PushNotificationUpdateTokenAction
): Generator<*, *, *> {
  // TODO:KS Rename this method to onPushTokenUpdate
  // once integration with vcx is done for both ios and android

  // We can come to this point in code from several paths
  // 1. this is called when user is trying to accept connection first time
  // 2. this can be called when we are hydrating app data and we put push token
  // 3. can be called when Firebase Push plugin updates push token

  yield* ensureVcxInitSuccess()

  try {
    const pushToken = `FCM:${action.token}`
    const id = yield uniqueId()
    yield call(updatePushTokenVcx, { uniqueId: id, pushToken })
  } catch (e) {
    captureError(e)
  }
}

export function* onPushTokenUpdate(
  action: PushNotificationUpdateTokenAction
): Generator<*, *, *> {
  // TODO:KS Once we have integrated vcx with both ios and android
  // then we will remove method onPushTokenUpdate
  // and use onPushTokenUpdateVcx, because that is what flow will be when using vcx
  if (Platform.OS === 'android') {
    yield* onPushTokenUpdateVcx(action)

    return
  }

  const { token } = action
  // We can come to this point in code from several paths
  // 1. this is called when user is trying to accept connection first time
  // 2. this can be called when we are hydrating app data and we put push token
  // 3. can be called when Firebase Push plugin updates push token

  // we need to check first that app is hydrated
  const isHydrated = yield select(getHydrationState)
  if (!isHydrated) {
    // if app is not hydrated and we still get push token update
    // that means app is being hydrated and it is coming from scenario 2 or 3
    // so we wait for app to be hydrated
    // also, we need to wait for hydrated because we need user one time info
    yield take(HYDRATED)
  }

  // now if app is hydrated, so we know that this can either of three scenarios

  let userOneTimeInfo = yield select(getUserOneTimeInfo)
  if (!userOneTimeInfo) {
    // we tried to get user one time info from redux store and we did not find it
    // this is for scenario 1
    // if app is hydrated and this is the first time user is trying to establish
    // connection, then we wait for one time process to complete,
    // so that we have user one time info available for encryption
    // wait (yield take) for one time registration process to complete
    // and then we can update push token
    const oneTimeProcessCompleteAction: {
      userOneTimeInfo: UserOneTimeInfo,
    } = yield take(CONNECT_REGISTER_CREATE_AGENT_DONE)
    userOneTimeInfo = oneTimeProcessCompleteAction.userOneTimeInfo
  }

  // we don't need an else condition here because
  // either we got one time info from store or from one time process action
  // so for both scenario 2 & 3, we will get user one time info
  // as soon as hydrated is success

  const agencyUrl: string = yield select(getAgencyUrl)
  const poolConfig: string = yield select(getPoolConfig)
  const agencyVerificationKey: string = yield select(getAgencyVerificationKey)
  const pushComMethod = `FCM:${token}`
  try {
    const id = yield uniqueId()
    try {
      const url = `${agencyUrl}/agency/msg`
      const response = yield call(updatePushTokenApi, {
        url,
        token: pushComMethod,
        uniqueDeviceId: id,
        myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
        myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
        myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
        myAgencyVerKey: agencyVerificationKey,
        poolConfig,
      })
    } catch (e) {
      captureError(e)
    }
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

export function* fetchAdditionalDataSaga(
  action: FetchAdditionalDataAction
): Generator<*, *, *> {
  if (Platform.OS === 'android') {
    // TODO: KS Once integration with vcx is done for both ios and android
    // we will remove fetchAdditionalDataSaga and use fetchAdditionalDataSagaVcx
    yield* fetchAdditionalDataSagaVcx(action)

    return
  }

  const { forDID, uid, type, senderLogoUrl } = action.notificationPayload
  const isHydrated = yield select(getHydrationState)
  if (!isHydrated) {
    yield take(HYDRATED)
  }

  if (forDID) {
    const { remotePairwiseDID, remoteName, ...connection } = yield select(
      getRemotePairwiseDidAndName,
      forDID
    )

    if (remotePairwiseDID) {
      try {
        const userOneTimeInfo: UserOneTimeInfo = yield select(
          getUserOneTimeInfo
        )
        const agencyUrl: string = yield select(getAgencyUrl)
        const poolConfig: string = yield select(getPoolConfig)
        const agencyVerificationKey: string = yield select(
          getAgencyVerificationKey
        )
        const url = `${agencyUrl}/agency/msg`
        const additionalDataResponse: AdditionalDataResponse = yield call(
          getMessage,
          {
            url,
            requestId: uid,
            myPairwiseDid: connection.myPairwiseDid,
            myPairwiseVerKey: connection.myPairwiseVerKey,
            myPairwiseAgentDid: connection.myPairwiseAgentDid,
            myPairwiseAgentVerKey: connection.myPairwiseAgentVerKey,
            myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
            myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
            myOneTimeDid: userOneTimeInfo.myOneTimeDid,
            myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
            myAgencyVerKey: agencyVerificationKey,
            poolConfig,
          }
        )

        const additionalData = JSON.parse(additionalDataResponse.payload)
        yield put(
          pushNotificationReceived({
            type,
            additionalData: {
              remoteName,
              ...additionalData,
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
    } else {
      yield put(
        fetchAdditionalDataError({
          code: 'OCS-002',
          message: 'No pairwise connection found',
        })
      )
    }
  } else {
    yield put(
      fetchAdditionalDataError({
        code: 'OCS-001',
        message: 'Missing forDID in notification payload',
      })
    )
  }
}

export function* fetchAdditionalDataSagaVcx(
  action: FetchAdditionalDataAction
): Generator<*, *, *> {
  yield* ensureVcxInitSuccess()

  const { forDID, uid, type, senderLogoUrl } = action.notificationPayload

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
      // TODO:KS Pass parameters that are needed to download proof request
      additionalData = yield call(downloadProofRequest)
    }

    if (!additionalData) {
      // we did not get any data or either push notification type is not supported
      return
    }

    yield put(
      pushNotificationReceived({
        type,
        additionalData: {
          remoteName,
          ...additionalData,
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
  yield takeLatest(FETCH_ADDITIONAL_DATA, fetchAdditionalDataSaga)
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
    case PUSH_NOTIFICATION_UPDATE_TOKEN:
      return {
        ...state,
        pushToken: action.token,
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

// @flow

import { call, all, takeLatest, take, select, put } from 'redux-saga/effects'
import { encode } from 'bs58'
import { sendUpdatedPushToken, getAdditionalData } from '../api/api'
import { PAYLOAD_TYPE } from '../api/api-constants'
import { captureError } from '../services/error/error-handler'
import {
  getAgencyUrl,
  getAllConnection,
  getRemotePairwiseDidAndName,
  getHydrationState,
} from '../store/store-selector'
import { encrypt } from '../bridge/react-native-cxs/RNCxs'
import {
  PUSH_NOTIFICATION_PERMISSION,
  PUSH_NOTIFICATION_UPDATE_TOKEN,
  PUSH_NOTIFICATION_RECEIVED,
  FETCH_ADDITIONAL_DATA,
  FETCH_ADDITIONAL_DATA_ERROR,
} from './type-push-notification'

import type { CustomError } from '../common/type-common'
import type {
  NotificationPayload,
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
} from './type-push-notification'
import type { Connections } from '../connection/type-connection'
import { HYDRATED } from '../store/type-config-store'

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

export function* onPushTokenUpdate(
  action: PushNotificationUpdateTokenAction
): Generator<*, *, *> {
  const { token } = action
  const agencyUrl: string = yield select(getAgencyUrl)
  const connections: Connections = yield select(getAllConnection)
  // TODO all these requests should be done in parallel instead of serial.
  // And if one request fails, all other will not even be sent.
  for (let DID in connections) {
    if (connections.hasOwnProperty(DID)) {
      try {
        const dataBody = {
          to: DID,
          agentPayload: JSON.stringify({
            type: PAYLOAD_TYPE.UPDATE_PUSH_COM_METHOD,
            pushComMethod: `FCM:${token}`,
          }),
        }

        yield call(sendUpdatedPushToken, {
          agencyUrl,
          dataBody,
        })
      } catch (e) {
        captureError(e)
      }
    }
  }
}

function* watchPushTokenUpdate() {
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

export function* additionalDataFetching(
  action: FetchAdditionalDataAction
): Generator<*, *, *> {
  const agencyUrl: string = yield select(getAgencyUrl)
  const { forDID, uid, type, senderLogoUrl } = action.notificationPayload
  const isHydrated = yield select(getHydrationState)
  if (!isHydrated) {
    yield take(HYDRATED)
  }
  if (forDID) {
    const { remotePairwiseDID, remoteName } = yield select(
      getRemotePairwiseDidAndName,
      forDID
    )

    if (remotePairwiseDID) {
      try {
        const additionalDataResponse: AdditionalDataResponse = yield call(
          getAdditionalData,
          {
            agencyUrl,
            dataBody: {
              to: forDID,
              agentPayload: JSON.stringify({
                uid,
                type: PAYLOAD_TYPE.GET_MESSAGE,
                includeEdgePayload: 'Y',
              }),
            },
          }
        )

        const additionalData = JSON.parse(
          additionalDataResponse.msgs[0].edgeAgentPayload
        )
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

function* watchFetchAdditionalData(): Generator<*, *, *> {
  yield takeLatest(FETCH_ADDITIONAL_DATA, additionalDataFetching)
}

export function* watchPushNotification(): Generator<*, *, *> {
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
    default:
      return state
  }
}

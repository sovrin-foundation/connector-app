import { call, all, takeLatest, select } from 'redux-saga/effects'
import { encode } from 'bs58'
import {
  sendUpdatedPushToken,
  getKeyPairFromSeed,
  getSignature,
  captureError,
  PAYLOAD_TYPE,
} from '../services'
import { getAgencyUrl, getAllConnection } from './store-selector'
import { encrypt } from '../bridge/react-native-cxs/RNCxs'

const initialState = {
  isAllowed: false,
  notification: null,
  pushToken: null,
}

const PUSH_NOTIFICATION_PERMISSION = 'PUSH_NOTIFICATION_PERMISSION'
const PUSH_NOTIFICATION_RECEIVED = 'PUSH_NOTIFICATION_RECEIVED'
const PUSH_NOTIFICATION_TOKEN = 'PUSH_NOTIFICATION_TOKEN'

export const pushNotificationPermissionAction = isAllowed => ({
  type: PUSH_NOTIFICATION_PERMISSION,
  isAllowed,
})

export const pushNotificationReceived = notification => ({
  type: PUSH_NOTIFICATION_RECEIVED,
  notification,
})

export const updatePushToken = token => ({
  type: PUSH_NOTIFICATION_TOKEN,
  token,
})

export function* onPushTokenUpdate(action) {
  const { token } = action
  const agencyUrl = yield select(getAgencyUrl)
  const connections = yield select(getAllConnection)
  let secretKey, challenge, signature
  for (let DID in connections) {
    if (connections.hasOwnProperty(DID)) {
      challenge = JSON.stringify({ pushComMethod: `FCM:${token}` })
      signature = yield call(encrypt, DID, challenge)
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
  yield takeLatest(PUSH_NOTIFICATION_TOKEN, onPushTokenUpdate)
}

export function* watchPushNotification() {
  yield all([watchPushTokenUpdate()])
}

export default function pushNotification(state = initialState, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION_PERMISSION:
      return {
        ...state,
        isAllowed: action.isAllowed,
      }
    case PUSH_NOTIFICATION_RECEIVED:
      return {
        ...state,
        notification: action.notification,
      }
    case PUSH_NOTIFICATION_TOKEN:
      return {
        ...state,
        pushToken: action.token,
      }
    default:
      return state
  }
}

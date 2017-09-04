// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import { encode } from 'bs58'
import type {
  PendingConnectionRequestAction,
  PendingConnectionSuccessAction,
  PendingConnectionFailAction,
  SMSConnectionRequestStore,
  SMSConnectionReceivedAction,
  SMSConnectionAction,
  SMSConnectionReceivedActionData,
  SMSConnectionResponseSendData,
  SMSConnectionResponseSendAction,
  SMSConnectionSuccessAction,
  SMSConnectionFailAction,
  Error,
} from './type-sms-connection-request'
import {
  PENDING_SMS_CONNECTION_REQUEST,
  PENDING_SMS_CONNECTION_SUCCESS,
  PENDING_SMS_CONNECTION_FAIL,
  SMS_CONNECTION_REQUEST,
  SMS_CONNECTION_RESPONSE_SUCCESS,
  SMS_CONNECTION_RESPONSE_FAIL,
  SMS_CONNECTION_RESPONSE_SEND,
} from './type-sms-connection-request'
import { ResponseType } from '../components/request/type-request'
import {
  getKeyPairFromSeed,
  getSignature,
  randomSeed,
  sendSMSInvitationResponse,
  invitationDetailsRequest,
  invitationPayloadMapper,
} from '../services'
import {
  getAgencyUrl,
  getPushToken,
  getSMSToken,
  getSMSRemoteConnectionId,
  getAllConnection,
} from '../store/store-selector'
import { saveNewConnection, getConnection } from '../store/connections-store'

const initialState = {
  payload: {},
  status: ResponseType.none,
  isFetching: false,
  error: null,
}

export const getSMSConnectionRequestDetails = (): PendingConnectionRequestAction => ({
  type: PENDING_SMS_CONNECTION_REQUEST,
})

export const pendingSMSConnectionFail = (
  error: Error
): PendingConnectionFailAction => ({
  type: PENDING_SMS_CONNECTION_FAIL,
  error,
})

export function* callPendingSMSConnectionRequest(): Generator<*, *, *> {
  const agencyUrl: string = yield select(getAgencyUrl)
  const smsToken: string = yield select(getSMSToken)
  try {
    const pendingConnectionResponse = yield call(invitationDetailsRequest, {
      smsToken,
      agencyUrl,
    })
    yield put(
      smsConnectionRequestReceived(
        invitationPayloadMapper(pendingConnectionResponse)
      )
    )
  } catch (e) {
    yield put(pendingSMSConnectionFail(JSON.parse(e.message)))
  }
}

function* watchPendingConnectionRequest(): Generator<*, *, *> {
  yield takeLatest(
    PENDING_SMS_CONNECTION_REQUEST,
    callPendingSMSConnectionRequest
  )
}

export const smsConnectionRequestReceived = (
  data: SMSConnectionReceivedActionData
): SMSConnectionReceivedAction => ({
  type: SMS_CONNECTION_REQUEST,
  data,
})

export const sendSMSConnectionResponse = (
  data: SMSConnectionResponseSendData
): SMSConnectionResponseSendAction => ({
  type: SMS_CONNECTION_RESPONSE_SEND,
  data,
})

export const smsConnectionSuccess = (): SMSConnectionSuccessAction => ({
  type: SMS_CONNECTION_RESPONSE_SUCCESS,
})

export const smsConnectionFail = (error: Error): SMSConnectionFailAction => ({
  type: SMS_CONNECTION_RESPONSE_FAIL,
  error,
})

export function* sendSMSResponse(
  action: SMSConnectionResponseSendAction
): Generator<*, *, *> {
  const identifier = randomSeed(32).substring(0, 22)
  const seed = randomSeed(32).substring(0, 32)

  // get data needed for agent api call from store
  // this will keep our components and screen to not pass data
  // and will keep our actions clean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const smsToken: string = yield select(getSMSToken)
  const remoteConnectionId: string = yield select(getSMSRemoteConnectionId)

  const connections = yield select(getAllConnection)
  const isDuplicateConnection =
    getConnection(remoteConnectionId, connections).length > 0

  if (isDuplicateConnection) {
    const error = {
      code: 'OCS',
      message: 'duplicate connection request',
    }
    yield put(smsConnectionFail(error))
  } else {
    const { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
      seed
    )
    const challenge = JSON.stringify({
      newStatus: action.data.response,
      identifier,
      verKey: encode(verKey),
      pushComMethod: `FCM:${pushToken}`,
    })
    const signature = encode(getSignature(signingKey, challenge))

    try {
      yield call(sendSMSInvitationResponse, {
        agencyUrl,
        challenge,
        signature,
        smsToken,
      })
      yield put(smsConnectionSuccess())
      // TODO:PS:merge common code from this saga and qr connection response saga.
      if (action.data.response === ResponseType.accepted) {
        const connection = {
          newConnection: {
            identifier,
            remoteConnectionId,
            seed,
          },
        }
        yield put(saveNewConnection(connection))
      }
    } catch (e) {
      const error: Error = JSON.parse(e.message)
      yield put(smsConnectionFail(error))
    }
  }
}

function* watchSMSConnection(): Generator<*, *, *> {
  yield takeLatest(SMS_CONNECTION_RESPONSE_SEND, sendSMSResponse)
}

export function* watchSMSConnectionSagas(): Generator<*, *, *> {
  yield all([watchPendingConnectionRequest(), watchSMSConnection()])
}

export default function smsConnectionRequestReducer(
  state: SMSConnectionRequestStore = initialState,
  action: SMSConnectionAction
) {
  switch (action.type) {
    case PENDING_SMS_CONNECTION_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case PENDING_SMS_CONNECTION_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }

    case SMS_CONNECTION_REQUEST:
      return {
        ...state,
        isFetching: false,
        payload: {
          ...action.data,
        },
      }

    case SMS_CONNECTION_RESPONSE_SEND:
      return {
        ...state,
        isFetching: true,
        status: action.data.response,
      }

    case SMS_CONNECTION_RESPONSE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null,
      }

    case SMS_CONNECTION_RESPONSE_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        status: ResponseType.none,
      }

    default:
      return state
  }
}

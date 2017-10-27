// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import type { Error } from '../common/type-common'
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
  connectWithConsumerAgency,
  registerWithConsumerAgency,
  createAgentWithConsumerAgency,
  sendInvitationResponse,
  invitationDetailsRequest,
  invitationPayloadMapper,
  getInvitationLink,
} from '../services'
import type { InvitationPayload } from '../services/mapper/type-mapper'
import { API_TYPE } from '../services/api'
import {
  getAgencyUrl,
  getPushToken,
  getSMSToken,
  getSMSRemoteConnectionId,
  getAllConnection,
  getSmsInvitationPayload,
} from '../store/store-selector'
import { saveNewConnection, getConnection } from '../store/connections-store'
import { encrypt, addConnection } from '../bridge/react-native-cxs/RNCxs'

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
    // get invitation link
    const invitationData = yield call(getInvitationLink, {
      agencyUrl,
      smsToken,
    })

    // get pending invitation data
    const pendingConnectionResponse = yield call(invitationDetailsRequest, {
      url: invitationData.url,
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
  // get data needed for agent api call from store using selectors
  // this will keep our components and screen to not pass data
  // and will keep our actions clean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const smsPayload: InvitationPayload = yield select(getSmsInvitationPayload)
  // TODO: Pradeep add type for connections
  const connections = yield select(getAllConnection)
  const isDuplicateConnection =
    getConnection(smsPayload.senderDID, connections).length > 0

  if (isDuplicateConnection) {
    const error = {
      code: 'OCS',
      message: 'duplicate connection request',
    }
    yield put(smsConnectionFail(error))
  } else {
    const metadata = {
      senderDID: smsPayload.senderDID,
    }
    const { identifier, verificationKey } = yield call(
      addConnection,
      smsPayload.senderDID,
      metadata
    )

    try {
      // connect with consumer agency
      const connectResponse = yield call(connectWithConsumerAgency, {
        agencyUrl,
        dataBody: {
          type: API_TYPE.CONNECT,
          fromDID: identifier,
          fromDIDVerKey: verificationKey,
        },
      })
      // register with consumer agency
      const registerResponse = yield call(registerWithConsumerAgency, {
        agencyUrl,
        dataBody: {
          type: API_TYPE.REGISTER,
          fromDID: identifier,
        },
      })
      // create agent
      const createAgentResponse = yield call(createAgentWithConsumerAgency, {
        agencyUrl,
        dataBody: {
          type: API_TYPE.CREATE_AGENT,
          forDID: identifier,
        },
      })

      const dataBody = {
        to: identifier,
        agentPayload: JSON.stringify({
          type: API_TYPE.INVITE_ANSWERED,
          uid: smsPayload.connReqId,
          keyDlgProof: 'delegate to agent',
          senderName: smsPayload.senderName,
          senderLogoUrl: smsPayload.senderLogoUrl,
          senderDID: smsPayload.senderDID,
          senderDIDVerKey: smsPayload.senderDIDVerKey,
          remoteAgentKeyDlgProof: 'delegated to agent',
          remoteEndpoint: smsPayload.senderEndpoint,
          pushComMethod: `FCM:${pushToken}`,
        }),
      }
      const acceptInvitationResponse = yield call(sendInvitationResponse, {
        agencyUrl,
        dataBody,
      })

      yield put(smsConnectionSuccess())
      // TODO:PS:merge common code from this saga and qr connection response saga
      if (action.data.response === ResponseType.accepted) {
        const connection = {
          newConnection: {
            identifier,
            logoUrl: smsPayload.senderLogoUrl,
            senderDID: smsPayload.senderDID,
            senderEndpoint: smsPayload.senderEndpoint,
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

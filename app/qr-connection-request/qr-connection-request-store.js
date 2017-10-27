// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import { encode } from 'bs58'
import type {
  QrConnectionRequestStore,
  QrConnectionReceivedAction,
  QrConnectionAction,
  QrConnectionReceivedActionData,
  QrConnectionResponseSendData,
  QrConnectionResponseSendAction,
  QrConnectionSuccessAction,
  QrConnectionFailAction,
  Error,
} from './type-qr-connection-request'
import type { QrCode } from '../components/qr-scanner/type-qr-scanner'
import type { ConfigStore } from '../store/type-store'
import {
  QR_CONNECTION_REQUEST,
  QR_CONNECTION_RESPONSE_SUCCESS,
  QR_CONNECTION_RESPONSE_FAIL,
  QR_CONNECTION_RESPONSE_SEND,
} from './type-qr-connection-request'
import { ResponseType } from '../components/request/type-request'
import {
  getKeyPairFromSeed,
  getSignature,
  verifySignature,
  randomSeed,
  sendQRInvitationResponse,
  connectWithConsumerAgency,
  registerWithConsumerAgency,
  createAgentWithConsumerAgency,
  sendInvitationResponse,
} from '../services'
import {
  QR_CODE_CHALLENGE,
  QR_CODE_SENDER_DID,
  QR_CODE_REQUEST_ID,
  QR_CODE_LOGO_URL,
  QR_CODE_SENDER_NAME,
  QR_CODE_AGENT_PROOF,
  QR_CODE_SENDER_VERIFICATION_KEY,
  QR_CODE_SENDER_ENDPOINT,
  API_TYPE,
} from '../services/api'
import {
  getAgencyUrl,
  getPushToken,
  getQrPayload,
  getAllConnection,
} from '../store/store-selector'
import { saveNewConnection, getConnection } from '../store/connections-store'
import { encrypt, addConnection } from '../bridge/react-native-cxs/RNCxs'

export const qrConnectionInitialState = {
  title: '',
  message: '',
  senderLogoUrl: null,
  payload: null,
  status: ResponseType.none,
  isFetching: false,
  error: null,
}

export const qrConnectionRequestReceived = (
  data: QrConnectionReceivedActionData
): QrConnectionReceivedAction => ({
  type: QR_CONNECTION_REQUEST,
  data,
})

export const sendQrConnectionResponse = (
  data: QrConnectionResponseSendData
): QrConnectionResponseSendAction => ({
  type: QR_CONNECTION_RESPONSE_SEND,
  data,
})

export const qrConnectionSuccess = (): QrConnectionSuccessAction => ({
  type: QR_CONNECTION_RESPONSE_SUCCESS,
})

export const qrConnectionFail = (error: Error): QrConnectionFailAction => ({
  type: QR_CONNECTION_RESPONSE_FAIL,
  error,
})

export function* sendQrResponse(
  action: QrConnectionResponseSendAction
): Generator<*, *, *> {
  // get data needed for agent api call from store using selectors
  // this will keep our components and screen to not pass data
  // and will keep our actions lean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const qrCode: QrCode = yield select(getQrPayload)
  const connections = yield select(getAllConnection)
  const senderDID = qrCode[QR_CODE_SENDER_DID]
  const isDuplicateConnection = getConnection(senderDID, connections).length > 0

  if (isDuplicateConnection) {
    const error = {
      code: 'OCS',
      message: 'duplicate connection request',
    }
    yield put(qrConnectionFail(error))
  } else {
    const logoUrl = qrCode[QR_CODE_LOGO_URL]
    const senderEndpoint = qrCode[QR_CODE_SENDER_ENDPOINT]
    const metadata = {
      senderDID,
    }
    const { identifier, verificationKey } = yield call(
      addConnection,
      senderDID,
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
          uid: qrCode[QR_CODE_REQUEST_ID],
          // TODO: get this data from agent registration
          keyDlgProof: 'delegate to agent',
          senderName: qrCode[QR_CODE_SENDER_NAME],
          senderLogoUrl: logoUrl,
          senderDID,
          senderDIDVerKey: qrCode[QR_CODE_SENDER_VERIFICATION_KEY],
          remoteAgentKeyDlgProof: qrCode[QR_CODE_AGENT_PROOF],
          remoteEndpoint: senderEndpoint,
          pushComMethod: `FCM:${pushToken}`,
        }),
      }

      yield call(sendInvitationResponse, {
        agencyUrl,
        dataBody,
      })
      yield put(qrConnectionSuccess())
      if (action.data.response === ResponseType.accepted) {
        const connection = {
          newConnection: {
            identifier,
            senderDID,
            logoUrl,
            senderEndpoint,
          },
        }
        yield put(saveNewConnection(connection))
      }
    } catch (e) {
      const error: Error = JSON.parse(e.message)
      yield put(qrConnectionFail(error))
    }
  }
}

function* watchSendQrResponse() {
  yield takeLatest(QR_CONNECTION_RESPONSE_SEND, sendQrResponse)
}

export function* watchQrConnection(): Generator<*, *, *> {
  yield all([watchSendQrResponse()])
}

export default function qrConnectionRequestReducer(
  state: QrConnectionRequestStore = qrConnectionInitialState,
  action: QrConnectionAction
) {
  switch (action.type) {
    case QR_CONNECTION_REQUEST:
      return {
        ...state,
        ...action.data,
      }

    case QR_CONNECTION_RESPONSE_SEND:
      return {
        ...state,
        isFetching: true,
        status: action.data.response,
      }

    case QR_CONNECTION_RESPONSE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null,
      }

    case QR_CONNECTION_RESPONSE_FAIL:
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

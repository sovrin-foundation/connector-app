// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import { encode } from 'bs58'
import type {
  QrConnectionRequestStore,
  QrConnectionPayload,
  QrConnectionReceivedAction,
  QrConnectionAction,
  QrConnectionReceivedActionData,
  QrConnectionResponseSendData,
  QrConnectionResponseSendAction,
  QrConnectionSuccessAction,
  QrConnectionFailAction,
  Error,
} from './type-qr-connection-request'
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
} from '../services'
import {
  QR_CODE_CHALLENGE,
  QR_CODE_REMOTE_PAIR_WISE_DID,
  QR_CODE_REMOTE_HOSTING_DID,
} from '../common'
import {
  getAgencyUrl,
  getPushToken,
  getQrPayload,
  getAllConnection,
} from '../store/store-selector'
import { saveNewConnection, getConnection } from '../store/connections-store'

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
  const identifier = randomSeed(32).substring(0, 22)
  const seed = randomSeed(32).substring(0, 32)

  // get data needed for agent api call from store
  // this will keep our components and screen to not pass data
  // and will keep our actions lean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const qrPayload: QrConnectionPayload = yield select(getQrPayload)

  const remoteConnectionId = qrPayload.challenge[QR_CODE_REMOTE_PAIR_WISE_DID]
  const connections = yield select(getAllConnection)
  const isDuplicateConnection =
    getConnection(remoteConnectionId, connections).length > 0

  if (isDuplicateConnection) {
    const error = {
      code: 'OCS',
      message: 'duplicate connection request',
    }
    yield put(qrConnectionFail(error))
  } else {
    const { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
      seed
    )
    const apiData = {
      remoteChallenge: qrPayload.qrData[QR_CODE_CHALLENGE],
      remoteSig: qrPayload.signature,
      newStatus: action.data.response,
      identifier,
      verKey: encode(verKey),
      pushComMethod: `FCM:${pushToken}`,
    }
    const challenge = JSON.stringify(apiData)
    const signature = encode(getSignature(signingKey, challenge))
    try {
      yield call(sendQRInvitationResponse, { challenge, signature, agencyUrl })
      yield put(qrConnectionSuccess())
      if (action.data.response === ResponseType.accepted) {
        const connection = {
          newConnection: {
            identifier,
            remoteConnectionId: remoteConnectionId,
            seed,
            remoteDID: qrPayload.challenge[QR_CODE_REMOTE_HOSTING_DID],
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

// @flow
import type {
  ResponseTypes,
  RequestDetailTextPropsText,
  RequestDetailAvatarProps,
} from '../components/request/type-request'

export type QrConnectionPayload = {
  challenge: {
    tDID: string,
    sn: string,
    tn: string,
    uid: string,
    rhDID: string,
    rpDID: string,
  },
  signature: string,
  qrData: {
    c: string,
    s: string,
  },
}

export type Error = {
  code: string,
  message: string,
}

export type QrConnectionRequestStore = RequestDetailTextPropsText &
  RequestDetailAvatarProps & {
    +payload?: ?QrConnectionPayload,
    +status: ResponseTypes,
    +isFetching: boolean,
    +error: ?Error,
  }

export const QR_CONNECTION_REQUEST: 'QR_CONNECTION_REQUEST' =
  'QR_CONNECTION_REQUEST'

export type QrConnectionReceivedActionData = RequestDetailTextPropsText & {
  payload: QrConnectionPayload,
}

export type QrConnectionReceivedAction = {
  type: typeof QR_CONNECTION_REQUEST,
  data: QrConnectionReceivedActionData,
}

export const QR_CONNECTION_RESPONSE_SEND: 'QR_CONNECTION_RESPONSE_SEND' =
  'QR_CONNECTION_RESPONSE_SEND'

export type QrConnectionResponseSendData = {
  response: ResponseTypes,
}

export type QrConnectionResponseSendAction = {
  type: typeof QR_CONNECTION_RESPONSE_SEND,
  data: QrConnectionResponseSendData,
}

export const QR_CONNECTION_RESPONSE_SUCCESS: 'QR_CONNECTION_RESPONSE_SUCCESS' =
  'QR_CONNECTION_RESPONSE_SUCCESS'

export type QrConnectionSuccessAction = {
  type: typeof QR_CONNECTION_RESPONSE_SUCCESS,
}

export const QR_CONNECTION_RESPONSE_FAIL: 'QR_CONNECTION_RESPONSE_FAIL' =
  'QR_CONNECTION_RESPONSE_FAIL'

export type QrConnectionFailAction = {
  type: typeof QR_CONNECTION_RESPONSE_FAIL,
  error: Error,
}

export const INITIAL_TEST_ACTION: 'INITIAL_TEST_ACTION' = 'INITIAL_TEST_ACTION'

export type QrConnectionTestAction = {
  type: typeof INITIAL_TEST_ACTION,
}

export type QrConnectionAction =
  | QrConnectionReceivedAction
  | QrConnectionResponseSendAction
  | QrConnectionFailAction
  | QrConnectionSuccessAction
  | QrConnectionTestAction

export type ReactNavigation = {
  navigation: {
    navigate: (route: string, params?: any) => void,
  },
}

export type QrConnectionRequestProps = {
  request: QrConnectionRequestStore,
  sendQrConnectionResponse: (data: QrConnectionResponseSendData) => void,
  showErrorAlerts: boolean,
} & ReactNavigation

export type QrConnectionRequestState = {
  isSuccessModalVisible: boolean,
}

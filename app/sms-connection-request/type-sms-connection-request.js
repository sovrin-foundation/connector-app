// @flow
import type {
  ResponseTypes,
  RequestDetailTextPropsText,
  RequestDetailAvatarProps,
} from '../components/request/type-request'
import { Error } from '../common/type-common'
import type {
  ReactNavigation,
  QrConnectionTestAction,
} from '../qr-connection-request/type-qr-connection-request'

export type SMSConnectionPayload = {
  title: String,
  message: String,
  senderLogoUrl?: String,
  connectionName?: String,
  remoteConnectionId: String,
  statusCode: String,
}

export type SMSConnectionRequestStore = {
  // TODO: Pradeep change this `any` to SMSConnectionPayload
  +payload: any,
  +status: ResponseTypes,
  +isFetching: boolean,
  +error?: ?Error,
}

export const PENDING_SMS_CONNECTION_REQUEST: 'PENDING_SMS_CONNECTION_REQUEST' =
  'PENDING_SMS_CONNECTION_REQUEST'

export type PendingConnectionRequestAction = {
  type: typeof PENDING_SMS_CONNECTION_REQUEST,
}

export const PENDING_SMS_CONNECTION_SUCCESS: 'PENDING_SMS_CONNECTION_SUCCESS' =
  'PENDING_SMS_CONNECTION_SUCCESS'

export type PendingConnectionSuccessAction = {
  type: typeof PENDING_SMS_CONNECTION_SUCCESS,
}

export const PENDING_SMS_CONNECTION_FAIL: 'PENDING_SMS_CONNECTION_FAIL' =
  'PENDING_SMS_CONNECTION_FAIL'

export type PendingConnectionFailAction = {
  type: typeof PENDING_SMS_CONNECTION_FAIL,
  error: Error,
}

export const SMS_CONNECTION_REQUEST: 'SMS_CONNECTION_REQUEST' =
  'SMS_CONNECTION_REQUEST'

export type SMSConnectionReceivedActionData = RequestDetailTextPropsText & {
  payload: SMSConnectionPayload,
}

export type SMSConnectionReceivedAction = {
  type: typeof SMS_CONNECTION_REQUEST,
  data: SMSConnectionReceivedActionData,
}

export const SMS_CONNECTION_RESPONSE_SEND: 'SMS_CONNECTION_RESPONSE_SEND' =
  'SMS_CONNECTION_RESPONSE_SEND'

export type SMSConnectionResponseSendData = {
  response: ResponseTypes,
}

export type SMSConnectionResponseSendAction = {
  type: typeof SMS_CONNECTION_RESPONSE_SEND,
  data: SMSConnectionResponseSendData,
}

export const SMS_CONNECTION_RESPONSE_SUCCESS: 'SMS_CONNECTION_RESPONSE_SUCCESS' =
  'SMS_CONNECTION_RESPONSE_SUCCESS'

export type SMSConnectionSuccessAction = {
  type: typeof SMS_CONNECTION_RESPONSE_SUCCESS,
}

export const SMS_CONNECTION_RESPONSE_FAIL: 'SMS_CONNECTION_RESPONSE_FAIL' =
  'SMS_CONNECTION_RESPONSE_FAIL'

export type SMSConnectionFailAction = {
  type: typeof SMS_CONNECTION_RESPONSE_FAIL,
  error: Error,
}

export type SMSConnectionAction =
  | PendingConnectionRequestAction
  | PendingConnectionSuccessAction
  | PendingConnectionFailAction
  | SMSConnectionReceivedAction
  | SMSConnectionResponseSendAction
  | SMSConnectionFailAction
  | SMSConnectionSuccessAction
  | QrConnectionTestAction

export type SMSConnectionRequestProps = {
  request: SMSConnectionRequestStore,
  sendSMSConnectionResponse: (data: SMSConnectionResponseSendData) => void,
} & ReactNavigation

export type SMSConnectionRequestState = {
  isSuccessModalVisible: boolean,
}

// @flow
import type { ConfigStore } from '../store/type-config-store'

export type AuthenticationStatus = {
  ACCEPTED: string,
  REJECTED: string,
  NONE: string,
}

export type AuthenticationType = {
  NONE: string,
  AUTHENTICATION_REQUEST: string,
}

export type AuthenticationError = {
  message: string,
  authenticationType: string,
}

type Invitee = {
  +image: string,
}

type Inviter = {
  +image: string,
}

type DataBody = {
  challenge: string,
  signature?: string,
}

export type AuthenticationSuccessData = {
  newStatus: string,
  identifier: string,
  dataBody: DataBody,
  remoteConnectionId: string,
}

export type AuthenticationStore = {
  +inviter: Inviter,
  +invitee: Invitee,
  +data: ?AuthenticationPayload,
  +error: ?AuthenticationError,
  +type: string,
  +status: string,
  +isFetching: boolean,
  +isPristine: boolean,
}

export type AuthenticationPayload =
  | {
      offerMsgTitle: string,
      offerMsgText: string,
      logoUrl: ?string,
      name?: string,
      statusMsg?: string,
      remoteConnectionId: string,
    }
  | AuthenticationSuccessData

export type NewConnection = {
  identifier: string,
  remoteConnectionId: string,
  seed: string,
  remoteDID: string,
}

export type AuthenticationAction =
  | SendUserAuthenticationResponse
  | SendUserAuthenticationResponseSuccess
  | SendUserAuthenticationResponseFailure
  | AuthenticationRequestReceived
  | ResetAuthenticationStatus

const AUTHENTICATION_REQUEST_RECEIVED = 'AUTHENTICATION_REQUEST_RECEIVED'
const SEND_USER_AUTHENTICATION_RESPONSE = 'SEND_USER_AUTHENTICATION_RESPONSE'
const SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS =
  'SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS'
const SEND_USER_AUTHENTICATION_RESPONSE_FAILURE =
  'SEND_USER_AUTHENTICATION_RESPONSE_FAILURE'
const RESET_AUTHENTICATION_STATUS = 'RESET_AUTHENTICATION_STATUS'

export type SendUserAuthenticationResponse = {
  type: typeof SEND_USER_AUTHENTICATION_RESPONSE,
  data: AuthenticationSuccessData,
  config: ConfigStore,
  authenticationType: string,
  token?: string,
  newConnection?: NewConnection,
}

export type SendUserAuthenticationResponseSuccess = {
  type: typeof SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS,
  data: AuthenticationSuccessData,
}

export type SendUserAuthenticationResponseFailure = {
  type: typeof SEND_USER_AUTHENTICATION_RESPONSE_FAILURE,
  error: AuthenticationError,
}

export type AuthenticationRequestReceived = {
  type: typeof AUTHENTICATION_REQUEST_RECEIVED,
  data: AuthenticationPayload,
}

export type ResetAuthenticationStatus = {
  type: typeof RESET_AUTHENTICATION_STATUS,
}

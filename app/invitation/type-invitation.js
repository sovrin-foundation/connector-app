// @flow
import type {
  ResponseTypes,
  RequestDetailTextPropsText,
  RequestDetailAvatarProps,
} from '../components/request/type-request'
import type {
  CustomError,
  ReactNavigation,
  InitialTestAction,
  ResetAction,
} from '../common/type-common'
import type {
  InvitationSenderAgencyDetail,
  AgentKeyDelegationProof,
  InvitationSenderDetail,
} from '../sms-pending-invitation/type-sms-pending-invitation'

export type InvitationPayload = {
  senderEndpoint: string,
  requestId: string,
  senderAgentKeyDelegationProof: AgentKeyDelegationProof,
  senderName: string,
  senderDID: string,
  senderLogoUrl: string,
  senderVerificationKey: string,
  targetName: string,
  senderDetail: InvitationSenderDetail,
  senderAgencyDetail: InvitationSenderAgencyDetail,
}

export type Invitation = {
  +payload: ?InvitationPayload,
  +status: ResponseTypes,
  +isFetching: boolean,
  +error: ?CustomError,
}

export type InvitationStore = {
  +[string]: Invitation,
}

export const INVITATION_RECEIVED: 'INVITATION_RECEIVED' = 'INVITATION_RECEIVED'

export type InvitationReceivedActionData = {
  payload: InvitationPayload,
}

export type InvitationReceivedAction = {
  type: typeof INVITATION_RECEIVED,
  data: InvitationReceivedActionData,
}

export const INVITATION_RESPONSE_SEND: 'INVITATION_RESPONSE_SEND' =
  'INVITATION_RESPONSE_SEND'

export type InvitationResponseSendData = {
  response: ResponseTypes,
  senderDID: string,
}

export type InvitationResponseSendAction = {
  type: typeof INVITATION_RESPONSE_SEND,
  data: InvitationResponseSendData,
}

export const INVITATION_RESPONSE_SUCCESS: 'INVITATION_RESPONSE_SUCCESS' =
  'INVITATION_RESPONSE_SUCCESS'

export type InvitationSuccessAction = {
  type: typeof INVITATION_RESPONSE_SUCCESS,
  senderDID: string,
}

export const INVITATION_RESPONSE_FAIL: 'INVITATION_RESPONSE_FAIL' =
  'INVITATION_RESPONSE_FAIL'

export type InvitationFailAction = {
  type: typeof INVITATION_RESPONSE_FAIL,
  error: CustomError,
  senderDID: string,
}

export const INVITATION_REJECTED: 'INVITATION_REJECTED' = 'INVITATION_REJECTED'

export type InvitationRejectedAction = {
  type: typeof INVITATION_REJECTED,
  senderDID: string,
}

export type InvitationAction =
  | InvitationReceivedAction
  | InvitationResponseSendAction
  | InvitationFailAction
  | InvitationSuccessAction
  | InvitationRejectedAction
  | InitialTestAction
  | ResetAction

export type InvitationProps = {
  invitation: ?Invitation,
  sendInvitationResponse: (data: InvitationResponseSendData) => void,
  invitationRejected: (senderDID: string) => void,
  smsPendingInvitationSeen: (smsToken: ?string) => void,
  showErrorAlerts: boolean,
  smsToken: ?string,
  isSmsInvitationNotSeen: boolean,
} & ReactNavigation

export type InvitationState = {
  isSuccessModalVisible: boolean,
}

export const ERROR_INVITATION_VCX_INIT = {
  code: 'INVITATION-001',
  message: 'Could not initialize vcx while creating a connection',
}

export const ERROR_INVITATION_CONNECT = (message: string) => ({
  code: 'INVITATION-002',
  message: `Error while establishing a connection ${message}`,
})

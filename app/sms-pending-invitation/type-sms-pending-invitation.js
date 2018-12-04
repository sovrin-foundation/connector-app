// @flow
import type {
  CustomError,
  InitialTestAction,
  ResetAction,
} from '../common/type-common'

export const SMSPendingInvitationStatus = {
  NONE: 'NONE',
  FETCH_FAILED: 'FETCH_FAILED',
  RECEIVED: 'RECEIVED',
  SEEN: 'SEEN',
}

export type SMSPendingInvitationStatusType = $Keys<
  typeof SMSPendingInvitationStatus
>

export type AgentKeyDelegationProof = {
  agentDID: string,
  agentDelegatedKey: string,
  signature: string,
}

export type InvitationSenderDetail = {
  name: string,
  agentKeyDlgProof: AgentKeyDelegationProof,
  DID: string,
  logoUrl: string,
  verKey: string,
}

export type InvitationSenderAgencyDetail = {
  DID: string,
  verKey: string,
  endpoint: string,
}

export type SMSPendingInvitationPayload = {
  connReqId: string,
  statusCode: string,
  senderDetail: InvitationSenderDetail,
  senderAgencyDetail: InvitationSenderAgencyDetail,
  targetName: string,
}

export type SMSPendingInvitation = {
  +payload: ?SMSPendingInvitationPayload,
  +status: SMSPendingInvitationStatusType,
  +isFetching: boolean,
  +error?: ?CustomError,
}

export type SMSPendingInvitations = Array<
  SMSPendingInvitation & { invitationToken: string }
>

export type SMSPendingInvitationStore = {
  +[string]: SMSPendingInvitation,
}

export const SMS_PENDING_INVITATION_REQUEST: 'SMS_PENDING_INVITATION_REQUEST' =
  'SMS_PENDING_INVITATION_REQUEST'

export type SMSPendingInvitationRequestAction = {
  type: typeof SMS_PENDING_INVITATION_REQUEST,
  smsToken: string,
}

export const SMS_PENDING_INVITATION_RECEIVED: 'SMS_PENDING_INVITATION_RECEIVED' =
  'SMS_PENDING_INVITATION_RECEIVED'

export type SMSPendingInvitationReceivedAction = {
  type: typeof SMS_PENDING_INVITATION_RECEIVED,
  data: SMSPendingInvitationPayload,
  smsToken: string,
}

export const SMS_PENDING_INVITATION_FAIL: 'SMS_PENDING_INVITATION_FAIL' =
  'SMS_PENDING_INVITATION_FAIL'

export type SMSPendingInvitationFailAction = {
  type: typeof SMS_PENDING_INVITATION_FAIL,
  error: CustomError,
  smsToken: string,
}

export const SMS_PENDING_INVITATION_SEEN: 'SMS_PENDING_INVITATION_SEEN' =
  'SMS_PENDING_INVITATION_SEEN'

export type SMSPendingInvitationSeenAction = {
  type: typeof SMS_PENDING_INVITATION_SEEN,
  smsToken: string,
}

export const SAFE_TO_DOWNLOAD_SMS_INVITATION = 'SAFE_TO_DOWNLOAD_SMS_INVITATION'

export type SafeToDownloadSmsInvitationAction = {
  type: typeof SAFE_TO_DOWNLOAD_SMS_INVITATION,
}

export type SMSPendingInvitationAction =
  | SMSPendingInvitationRequestAction
  | SMSPendingInvitationReceivedAction
  | SMSPendingInvitationFailAction
  | SMSPendingInvitationSeenAction
  | SafeToDownloadSmsInvitationAction
  | InitialTestAction
  | ResetAction

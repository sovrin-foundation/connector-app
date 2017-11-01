// @flow
import type { CustomError, InitialTestAction } from '../common/type-common'

export const SMSPendingInvitationStatus = {
  NONE: 'NONE',
  FETCH_FAILED: 'FETCH_FAILED',
  RECEIVED: 'RECEIVED',
  SEEN: 'SEEN',
}

export type SMSPendingInvitationStatusType = $Keys<
  typeof SMSPendingInvitationStatus
>

export type SMSPendingInvitationPayload = {
  connReqId: string,
  targetName: string,
  senderName: string,
  senderLogoUrl: string,
  statusCode: string,
  senderDID: string,
  senderEndpoint: string,
  senderDIDVerKey: string,
  targetName: string,
  senderAgentKeyDlgProof: string,
}

export type SMSPendingInvitationStore = {
  +payload: ?SMSPendingInvitationPayload,
  +status: SMSPendingInvitationStatusType,
  +isFetching: boolean,
  +error?: ?CustomError,
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
}

export const SMS_PENDING_INVITATION_FAIL: 'SMS_PENDING_INVITATION_FAIL' =
  'SMS_PENDING_INVITATION_FAIL'

export type SMSPendingInvitationFailAction = {
  type: typeof SMS_PENDING_INVITATION_FAIL,
  error: CustomError,
}

export const SMS_PENDING_INVITATION_SEEN: 'SMS_PENDING_INVITATION_SEEN' =
  'SMS_PENDING_INVITATION_SEEN'

export type SMSPendingInvitationSeenAction = {
  type: typeof SMS_PENDING_INVITATION_SEEN,
}

export type SMSPendingInvitationAction =
  | SMSPendingInvitationRequestAction
  | SMSPendingInvitationReceivedAction
  | SMSPendingInvitationFailAction
  | SMSPendingInvitationSeenAction
  | InitialTestAction

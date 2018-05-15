// @flow
import type { CustomError, ResetAction } from '../common/type-common'
import type {
  AdditionalDataPayload,
  ClaimProofNavigation,
  Attribute,
  NotificationPayload,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'

export const CLAIM_OFFER_STATUS = {
  IDLE: 'IDLE',
  RECEIVED: 'RECEIVED',
  SHOWN: 'SHOWN',
  ACCEPTED: 'ACCEPTED',
  IGNORED: 'IGNORED',
  REJECTED: 'REJECTED',
}

export const CLAIM_REQUEST_STATUS = {
  NONE: 'NONE',
  SENDING_CLAIM_REQUEST: 'SENDING_CLAIM_REQUEST',
  CLAIM_REQUEST_FAIL: 'CLAIM_REQUEST_FAIL',
  CLAIM_REQUEST_SUCCESS: 'CLAIM_REQUEST_SUCCESS',
}

export type ClaimOfferStatus = $Keys<typeof CLAIM_OFFER_STATUS>
export type ClaimRequestStatus = $Keys<typeof CLAIM_REQUEST_STATUS>

export const CLAIM_OFFER_RECEIVED = 'CLAIM_OFFER_RECEIVED'
export type ClaimOfferReceivedAction = {
  type: typeof CLAIM_OFFER_RECEIVED,
  payload: AdditionalDataPayload,
  payloadInfo: NotificationPayloadInfo,
}

export const CLAIM_OFFER_FAILED = 'CLAIM_OFFER_FAILED'
export type ClaimOfferFailedAction = {
  type: typeof CLAIM_OFFER_FAILED,
  error: CustomError,
  uid: string,
}

export const CLAIM_OFFER_SHOWN = 'CLAIM_OFFER_SHOWN'
export type ClaimOfferShownAction = {
  type: typeof CLAIM_OFFER_SHOWN,
  uid: string,
}

export const CLAIM_OFFER_ACCEPTED = 'CLAIM_OFFER_ACCEPTED'
export type ClaimOfferAcceptedAction = {
  type: typeof CLAIM_OFFER_ACCEPTED,
  uid: string,
}

export const CLAIM_OFFER_REJECTED = 'CLAIM_OFFER_REJECTED'
export type ClaimOfferRejectedAction = {
  type: typeof CLAIM_OFFER_REJECTED,
  uid: string,
}

export const CLAIM_OFFER_IGNORED = 'CLAIM_OFFER_IGNORED'
export type ClaimOfferIgnoredAction = {
  type: typeof CLAIM_OFFER_IGNORED,
  uid: string,
}

export const SEND_CLAIM_REQUEST = 'SEND_CLAIM_REQUEST'
export type SendClaimRequestAction = {
  type: typeof SEND_CLAIM_REQUEST,
  uid: string,
  payload: ClaimOfferPayload,
}

export const CLAIM_REQUEST_SUCCESS = 'CLAIM_REQUEST_SUCCESS'
export type ClaimRequestSuccessAction = {
  type: typeof CLAIM_REQUEST_SUCCESS,
  uid: string,
}

export const CLAIM_REQUEST_FAIL = 'CLAIM_REQUEST_FAIL'
export type ClaimRequestFailAction = {
  type: typeof CLAIM_REQUEST_FAIL,
  uid: string,
}

export const INITIAL_ACTION = 'INITIAL_ACTION'
export type ClaimRequestInitialAction = {
  type: typeof INITIAL_ACTION,
}

export type ClaimOfferAction =
  | ClaimOfferReceivedAction
  | ClaimOfferFailedAction
  | ClaimOfferShownAction
  | ClaimOfferAcceptedAction
  | ClaimOfferRejectedAction
  | SendClaimRequestAction
  | ClaimRequestSuccessAction
  | ClaimRequestFailAction
  | ClaimRequestInitialAction
  | ResetAction

// Assumption is that paid claim will have payTokenValue in ClaimOfferPayload/claimOfferData. CO-1329
export type ClaimOfferPayload = AdditionalDataPayload & {
  uid: string,
  senderLogoUrl?: ?string,
  remotePairwiseDID: string,
  status: ClaimOfferStatus,
  claimRequestStatus: ClaimRequestStatus,
  payTokenValue?: ?string,
}

export type ClaimOfferStore = {
  +[string]: ClaimOfferPayload,
}

export type ClaimOfferProps = {
  claimOfferShown: (uid: string) => void,
  acceptClaimOffer: (uid: string) => void,
  claimOfferRejected: (uid: string) => void,
  claimOfferIgnored: (uid: string) => void,
  updateStatusBarTheme: (color?: string) => void,
  navigation: ClaimProofNavigation,
  uid: string,
  claimOfferData: ClaimOfferPayload,
  isValid: boolean,
  logoUrl?: string,
  claimThemePrimary: string,
  claimThemeSecondary: string,
}

export type ClaimOfferState = {
  disableAcceptButton: boolean,
}

export type ClaimRequestStatusModalProps = {
  claimRequestStatus: ClaimRequestStatus,
  payload: ClaimOfferPayload,
  onContinue: () => void,
  senderLogoUrl?: string,
  isPending?: boolean,
  message1: string,
  message3: string,
  message5?: string,
}

export type ClaimRequestStatusModalState = {
  isVisible: boolean,
}

export type ClaimOfferResponse = {
  msgs: [
    {
      statusCode: string,
      edgeAgentPayload: string,
      typ: string,
      statusMsg: string,
      uid: string,
    },
  ],
}

export type ClaimOfferAttributeListProps = {
  list: Array<Attribute>,
}

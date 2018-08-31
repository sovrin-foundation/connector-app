// @flow
import type {
  CustomError,
  ResetAction,
  NotificationPayload,
} from '../common/type-common'
import type {
  AdditionalDataPayload,
  ClaimProofNavigation,
  Attribute,
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
export const VCX_CLAIM_OFFER_STATE = {
  NONE: 0,
  INITIALIZED: 1,
  UNFULFILLED: 5,
  EXPIRED: 6,
  REVOKED: 7,
  RECEIVED: 3,
  SENT: 2,
  ACCEPTED: 4,
}

export const CLAIM_REQUEST_STATUS = {
  NONE: 'NONE',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  SENDING_PAID_CREDENTIAL_REQUEST: 'SENDING_PAID_CREDENTIAL_REQUEST',
  SENDING_CLAIM_REQUEST: 'SENDING_CLAIM_REQUEST',
  CLAIM_REQUEST_FAIL: 'CLAIM_REQUEST_FAIL',
  CLAIM_REQUEST_SUCCESS: 'CLAIM_REQUEST_SUCCESS',
  PAID_CREDENTIAL_REQUEST_SUCCESS: 'PAID_CREDENTIAL_REQUEST_SUCCESS',
  PAID_CREDENTIAL_REQUEST_FAIL: 'PAID_CREDENTIAL_REQUEST_FAIL',
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

export const INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE'
export type InsufficientBalanceAction = {
  type: typeof INSUFFICIENT_BALANCE,
  uid: string,
}

export const SEND_PAID_CREDENTIAL_REQUEST = 'SEND_PAID_CREDENTIAL_REQUEST'
export type SendPaidCredentialRequestAction = {
  type: typeof SEND_PAID_CREDENTIAL_REQUEST,
  uid: string,
  payload: ClaimOfferPayload,
}

export const PAID_CREDENTIAL_REQUEST_SUCCESS = 'PAID_CREDENTIAL_REQUEST_SUCCESS'
export type PaidCredentialRequestSuccessAction = {
  type: typeof PAID_CREDENTIAL_REQUEST_SUCCESS,
  uid: string,
}

export const PAID_CREDENTIAL_REQUEST_FAIL = 'PAID_CREDENTIAL_REQUEST_FAIL'
export type PaidCredentialRequestFailAction = {
  type: typeof PAID_CREDENTIAL_REQUEST_FAIL,
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

export const ADD_SERIALIZED_CLAIM_OFFER = 'ADD_SERIALIZED_CLAIM_OFFER'
export type AddSerializedClaimOfferAction = {
  type: typeof ADD_SERIALIZED_CLAIM_OFFER,
  serializedClaimOffer: string,
  userDID: string,
  messageId: string,
  claimOfferVcxState: number,
}

export const CLAIM_OFFER_SHOW_START = 'CLAIM_OFFER_SHOW_START'
export type ClaimOfferShowStartAction = {
  type: typeof CLAIM_OFFER_SHOW_START,
  uid: string,
}

export const RESET_CLAIM_REQUEST_STATUS = 'RESET_CLAIM_REQUEST_STATUS'
export type ResetClaimRequestStatusAction = {
  type: typeof RESET_CLAIM_REQUEST_STATUS,
  uid: string,
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
  | AddSerializedClaimOfferAction
  | HydrateSerializedClaimOffersSuccessAction
  | ResetAction
  | InsufficientBalanceAction
  | SendPaidCredentialRequestAction
  | PaidCredentialRequestSuccessAction
  | PaidCredentialRequestFailAction
  | ClaimOfferShowStartAction
  | ResetClaimRequestStatusAction

export type ClaimOfferPayload = AdditionalDataPayload & {
  uid: string,
  senderLogoUrl?: ?string,
  remotePairwiseDID: string,
  status: ClaimOfferStatus,
  claimRequestStatus: ClaimRequestStatus,
  payTokenValue?: ?string,
}

export type SerializedClaimOffer = {
  serialized: string,
  state: number,
  messageId: string,
}

export type SerializedClaimOffersPerDid = {
  +[messageId: string]: SerializedClaimOffer,
}

export type SerializedClaimOffers = {
  +[userDID: string]: SerializedClaimOffersPerDid,
}

export type ClaimOfferStore = {
  +[string]: ClaimOfferPayload,
  // serialized offer are organized by user did so that we can directly
  // take all of offers for a connection and run update_state on all of them
  +vcxSerializedClaimOffers: SerializedClaimOffers,
}

export type ClaimOfferProps = {
  claimOfferShown: (uid: string) => void,
  acceptClaimOffer: (uid: string) => void,
  claimOfferRejected: (uid: string) => void,
  claimOfferIgnored: (uid: string) => void,
  updateStatusBarTheme: (color?: string) => void,
  claimOfferShowStart: (uid: string) => ClaimOfferShowStartAction,
  resetClaimRequestStatus: (uid: string) => ResetClaimRequestStatusAction,
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
  insufficientBalanceModalHidden: boolean,
}

export type ClaimRequestStatusModalProps = {
  claimRequestStatus: ClaimRequestStatus,
  payload: ClaimOfferPayload,
  onContinue: () => void,
  senderLogoUrl?: string,
  isPending?: boolean,
  message1?: string,
  message3: string,
  message5?: string,
  message6?: string,
  buttonDisabled?: boolean,
  payTokenValue?: ?string,
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

export const SAVE_CLAIM_OFFERS_SUCCESS = 'SAVE_CLAIM_OFFERS_SUCCESS'
export const SAVE_CLAIM_OFFERS_FAIL = 'SAVE_CLAIM_OFFERS_FAIL'
export const ERROR_SAVE_CLAIM_OFFERS = (message: string) => ({
  code: 'CO-001',
  message: `Error saving serialized claim offers: ${message}`,
})

export const REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS =
  'REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS'
export const REMOVE_SERIALIZED_CLAIM_OFFERS_FAIL =
  'REMOVE_SERIALIZED_CLAIM_OFFERS_FAIL'
export const ERROR_REMOVE_SERIALIZED_CLAIM_OFFERS = (message: string) => ({
  code: 'CO-002',
  message: `Error removing persisted serialized claim offers: ${message}`,
})

export const HYDRATE_CLAIM_OFFERS_SUCCESS = 'HYDRATE_CLAIM_OFFERS_SUCCESS'
export type HydrateSerializedClaimOffersSuccessAction = {
  type: typeof HYDRATE_CLAIM_OFFERS_SUCCESS,
  claimOffers: ClaimOfferStore,
}

export const HYDRATE_CLAIM_OFFERS_FAIL = 'HYDRATE_CLAIM_OFFERS_FAIL'
export const ERROR_HYDRATE_CLAIM_OFFERS = (message: string) => ({
  code: 'CO-003',
  message: `Error hydrating serialized claim offers: ${message}`,
})

export const CLAIM_OFFERS = 'CLAIM_OFFERS'

export const ERROR_NO_SERIALIZED_CLAIM_OFFER = (message: string) => ({
  code: 'CO-004',
  message: `No serialized claim offer found with this message id: ${message}`,
})

export const ERROR_SEND_CLAIM_REQUEST = (message: string) => ({
  code: 'CO-005',
  message: `Error occurred while trying to send/generate claim request: ${message}`,
})

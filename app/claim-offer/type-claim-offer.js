// @flow

export const CLAIM_OFFER_STATUS = {
  IDLE: 'IDLE',
  RECEIVED: 'RECEIVED',
  SHOWN: 'SHOWN',
  ACCEPTED: 'ACCEPTED',
  IGNORED: 'IGNORED',
  SENDING_RESPONSE: 'SENDING_RESPONSE',
  SENDING_RESPONSE_FAIL: 'SENDING_RESPONSE_FAIL',
}

export type ClaimOfferStatus = $Keys<typeof CLAIM_OFFER_STATUS>

export const CLAIM_OFFER_RECEIVED = 'CLAIM_OFFER_RECEIVED'
export type ClaimOfferReceivedAction = {
  type: typeof CLAIM_OFFER_RECEIVED,
}

export const CLAIM_OFFER_SHOWN = 'CLAIM_OFFER_SHOWN'
export type ClaimOfferShownAction = {
  type: typeof CLAIM_OFFER_SHOWN,
}

export type ClaimOfferAction = ClaimOfferReceivedAction | ClaimOfferShownAction

export type ClaimOfferStore = {
  status: ClaimOfferStatus,
}

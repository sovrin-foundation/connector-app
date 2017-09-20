// @flow
import {
  CLAIM_OFFER_STATUS,
  CLAIM_OFFER_RECEIVED,
  CLAIM_OFFER_SHOWN,
} from './type-claim-offer'
import type {
  ClaimOfferStore,
  ClaimOfferAction,
  ClaimOfferShownAction,
} from './type-claim-offer'

const claimOfferInitialState = {
  status: CLAIM_OFFER_STATUS.IDLE,
}

export const claimOfferReceived = () => ({
  type: CLAIM_OFFER_RECEIVED,
})

export const claimOfferShown = () => ({
  type: CLAIM_OFFER_SHOWN,
})

export default function claimOffer(
  state: ClaimOfferStore = claimOfferInitialState,
  action: ClaimOfferAction
) {
  switch (action.type) {
    case CLAIM_OFFER_RECEIVED:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.RECEIVED,
      }
    case CLAIM_OFFER_SHOWN:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.SHOWN,
      }
    default:
      return state
  }
}

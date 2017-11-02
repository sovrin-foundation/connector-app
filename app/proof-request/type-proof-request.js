// @flow
import type { CustomError } from '../common/type-common'
import type { ClaimOfferNotificationPayload as ProofRequestNotificationPayload } from '../claim-offer/type-claim-offer'

export type Attribute = {
  label: string,
  type?: string,
}

export type ProofRequest = {
  proofRequest: {
    name: string,
    version: string,
    revealedAttributes: Array<Attribute>,
  },
  issuer: {
    name: string,
    logoUrl: string,
    pairwiseDID: string,
  },
  statusMessage?: string,
}

export type ProofRequestPayload = {
  +[string]: ProofRequest,
}

export const FETCH_PROOF_REQUEST = 'FETCH_PROOF_REQUEST'
export type FetchProofRequestAction = {
  type: typeof FETCH_PROOF_REQUEST,
  notificationPayload: ProofRequestNotificationPayload,
}

export const FETCH_PROOF_REQUEST_ERROR = 'FETCH_PROOF_REQUEST_ERROR'
export type FetchProofRequestErrorAction = {
  type: typeof FETCH_PROOF_REQUEST_ERROR,
  error: CustomError,
}

export const PROOF_REQUEST_RECEIVED = 'PROOF_REQUEST_RECEIVED'
export type ProofRequestReceivedAction = {
  type: typeof PROOF_REQUEST_RECEIVED,
  payload: ProofRequestPayload,
}

export type ProofRequestAction =
  | FetchProofRequestAction
  | FetchProofRequestErrorAction
  | ProofRequestReceivedAction

export type ProofRequestStore = {
  +payload: ?ProofRequestPayload,
  isPristine: boolean,
  isFetching: boolean,
  error: ?CustomError,
}

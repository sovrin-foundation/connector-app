// @flow

import type {
  GenericObject,
  CustomError,
  InitialTestAction,
} from '../common/type-common'

export type Claim = {
  messageId: string,
  claim: { [string]: Array<string> },
  schema_seq_no: number,
  issuer_did: string,
  signature: {
    primary_claim: {
      m2: string,
      a: string,
      e: string,
      v: string,
    },
    non_revocation_claim?: GenericObject,
  },
  optional_data?: GenericObject,
  remoteDid: string,
  uid: string,
}

export const CLAIM_RECEIVED = 'CLAIM_RECEIVED'
export type ClaimReceivedAction = {
  type: typeof CLAIM_RECEIVED,
  claim: Claim,
}

export const CLAIM_STORAGE_SUCCESS = 'CLAIM_STORAGE_SUCCESS'
export type ClaimStorageSuccessAction = {
  type: typeof CLAIM_STORAGE_SUCCESS,
  messageId: string,
}

export const CLAIM_STORAGE_FAIL = 'CLAIM_STORAGE_FAIL'
export type ClaimStorageFailAction = {
  type: typeof CLAIM_STORAGE_FAIL,
  messageId: string,
  error: CustomError,
}

export type ClaimAction =
  | ClaimReceivedAction
  | ClaimStorageSuccessAction
  | ClaimStorageFailAction
  | InitialTestAction

export type ClaimStore = {
  +[string]: {
    claim: Claim,
    error?: CustomError,
  },
}

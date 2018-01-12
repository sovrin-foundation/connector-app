// @flow

import type {
  CustomError,
  InitialTestAction,
  GenericStringObject,
  GenericObject,
} from '../common/type-common'
import type { ProofRequestData } from '../proof-request/type-proof-request'

export type PrepareProof = any

export type ProofRevealedDetails = {
  primary_proof: {
    eq_proof: {
      revealed_attrs: GenericStringObject,
      a_prime: string,
      e: string,
      v: string,
      m: GenericObject,
      m1: string,
      m2: string,
    },
    ge_proofs: Array<string>,
  },
  non_revoc_proof: ?GenericObject,
}

export type Proof = {
  proofs: {
    [string]: {
      proof: ProofRevealedDetails,
      schema_seq_no: number,
      issuer_did: string,
    },
  },
  aggregated_proof: {
    c_hash: string,
    c_list: Array<Array<number>>,
  },
  requested_proof: {
    revealed_attrs: {
      [string]: Array<string>,
    },
    unrevealed_attrs: GenericObject,
    self_attested_attrs: GenericObject,
    predicates: GenericObject,
  },
}

export const GENERATE_PROOF = 'GENERATE_PROOF'
export type GenerateProofAction = {
  type: typeof GENERATE_PROOF,
  proofRequest: ProofRequestData,
  remoteDid: string,
  uid: string,
}

export const PROOF_SUCCESS = 'PROOF_SUCCESS'
export type ProofSuccessAction = {
  type: typeof PROOF_SUCCESS,
  proof: Proof,
  uid: string,
}

export const PROOF_FAIL = 'PROOF_FAIL'
export type ProofFailAction = {
  type: typeof PROOF_FAIL,
  uid: string,
  error: CustomError,
}

export const ERROR_CODE_MISSING_ATTRIBUTE = 'P000'
export const ERROR_MISSING_ATTRIBUTE_IN_CLAIMS: CustomError = {
  code: ERROR_CODE_MISSING_ATTRIBUTE,
  message:
    'Proof request cannot be fulfilled. Missing one or more asked attributes',
}

export type ProofAction =
  | GenerateProofAction
  | ProofSuccessAction
  | ProofFailAction
  | InitialTestAction

export type ProofStore = {
  +[string]: {
    proof: Proof,
    error?: CustomError,
  },
}

// @flow

import type { CustomError, InitialTestAction } from '../common/type-common'
import type { ProofRequestData } from '../proof-request/type-proof-request'

export type PrepareProof = any
export type Proof = any

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

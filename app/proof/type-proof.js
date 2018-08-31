// @flow

import type {
  CustomError,
  InitialTestAction,
  GenericStringObject,
  GenericObject,
  ResetAction,
} from '../common/type-common'
import type {
  ProofRequestData,
  SelfAttestedAttributes,
  IndySelfAttested,
  ProofRequestShowStartAction,
} from '../proof-request/type-proof-request'

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

export type IndyRequestedProof = {
  revealed_attrs: {
    [string]: Array<string>,
  },
  unrevealed_attrs: GenericObject,
  self_attested_attrs: GenericObject,
  predicates: GenericObject,
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
  requested_proof: IndyRequestedProof,
}

export type RequestedClaimsJson = {
  self_attested_attributes: IndySelfAttested,
  requested_attrs: IndyRequestedAttributes,
  requested_predicates: GenericObject,
}

export type RequestedAttrsJson = {
  +[string]: [string, boolean],
}

export const UPDATE_ATTRIBUTE_CLAIM = 'UPDATE_ATTRIBUTE_CLAIM'
export type UpdateAttributeClaimAction = {
  type: typeof UPDATE_ATTRIBUTE_CLAIM,
  requestedAttrsJson: RequestedAttrsJson,
}

export const GENERATE_PROOF = 'GENERATE_PROOF'
export type GenerateProofAction = {
  type: typeof GENERATE_PROOF,
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

export const ERROR_MISSING_ATTRIBUTE_IN_CLAIMS = (
  message: string
): CustomError => ({
  code: ERROR_CODE_MISSING_ATTRIBUTE,
  message,
})

export type IndySelfAttestedAttributes = {
  [attributeKey: string]: string,
}

export const USER_SELF_ATTESTED_ATTRIBUTES = 'USER_SELF_ATTESTED_ATTRIBUTES'
export type UserSelfAttestedAttributesAction = {
  type: typeof USER_SELF_ATTESTED_ATTRIBUTES,
  selfAttestedAttributes: SelfAttestedAttributes,
  uid: string,
}

export type MatchingCredential = {
  cred_info: {
    referent: string,
    attrs: { [claimAttributeName: string]: string },
    schema_id: string,
    cred_def_id: string,
  },
}

export type IndyPreparedProof = {
  attrs: {
    [attributeName: string]: ?Array<MatchingCredential | null>,
  },
  predicates: {},
  self_attested_attrs?: {},
}

export type IndyRequestedAttributes = {
  [attributeName: string]: [string, boolean, MatchingCredential],
}

export type VcxSelectedCredentials = {
  attrs?: {
    [attributeKey: string]: MatchingCredential,
  },
}

export type ProofAction =
  | GenerateProofAction
  | ProofSuccessAction
  | ProofFailAction
  | UserSelfAttestedAttributesAction
  | ProofRequestShowStartAction
  | InitialTestAction
  | ResetAction

export type ProofStore = {
  +[string]: {
    proof: Proof,
    error?: CustomError,
    selfAttestedAttributes?: SelfAttestedAttributes,
  },
}

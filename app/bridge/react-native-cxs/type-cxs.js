// @flow

export type Metadata = {
  [string]: any,
}

export type IndyClaimOffer = {
  issuerDid: string,
  schemaSequenceNumber: number,
}

export type IndyConnectionHistory = {
  issuerDid: string,
  schemaSequenceNumber: number,
}

export type IndyClaimRequest = {
  blinded_ms: {
    prover_did: string,
    u: string,
    ur?: string,
  },
  issuer_did: string,
  schema_seq_no: number,
}

export type ConnectAgencyResponse = {
  '@type': {
    name: string,
    ver: string,
  },
  withPairwiseDID: string,
  withPairwiseDIDVerKey: string,
}

export type RegisterAgencyResponse = {
  '@type': { name: string, ver: string },
}

export type CreateOneTimeAgentResponse = {
  '@type': { name: string, ver: string },
  withPairwiseDID: string,
  withPairwiseDIDVerKey: string,
}

export type CreatePairwiseAgentResponse = {
  '@type': { name: string, ver: string },
  withPairwiseDID: string,
  withPairwiseDIDVerKey: string,
}

export type AcceptInvitationResponse = {
  '@type': { name: string, ver: string },
  uid: string,
}

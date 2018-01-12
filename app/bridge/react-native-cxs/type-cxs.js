// @flow

export type Metadata = {
  [string]: string,
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

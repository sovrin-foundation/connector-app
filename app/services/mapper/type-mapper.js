// @flow

export type Connection = {
  logoUrl: string,
  size: number,
  name?: ?string,
  [string]: any,
}

export type ClaimOfferPayloadMapper = {
  claimOffer: string,
  issuer: string,
}

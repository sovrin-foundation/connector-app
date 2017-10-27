// @flow

export type Connection = {
  logoUrl: string,
  size: number,
  name?: ?string,
  [string]: any,
}

export type InvitationPayload = {
  connReqId: string,
  targetName: string,
  senderName: string,
  senderLogoUrl?: string,
  connectionName?: string,
  statusCode?: string,
  senderDID: string,
  senderEndpoint: string,
  senderDIDVerKey: string,
  targetName: string,
}

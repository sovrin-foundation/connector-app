// @flow

export type Connection = {
  logoUrl: string,
  size: number,
  name?: ?string,
  [string]: any,
}

export type InvitationPayload = {
  title: string,
  message: string,
  senderLogoUrl?: string,
  connectionName?: string,
  remoteConnectionId: string,
  statusCode: string,
}

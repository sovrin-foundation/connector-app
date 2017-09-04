// @flow

export type Connection = {
  logoUrl: string,
  size: number,
  name?: ?string,
  [string]: any,
}

export type InvitationPayload = {
  title: String,
  message: String,
  senderLogoUrl?: String,
  connectionName?: String,
  remoteConnectionId: String,
  statusCode: String,
}

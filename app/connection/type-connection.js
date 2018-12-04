// @flow

export type Connection = {
  identifier: string,
  logoUrl: ?string,
  name: string,
  senderDID: string,
  senderEndpoint: string,
  size: number,
}

export type Connections = {
  +[string]: Connection,
}

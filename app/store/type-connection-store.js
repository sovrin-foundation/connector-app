// @flow

export type Connection = {
  identifier: string,
  logoUrl: string,
  senderDID: string,
  senderEndpoint: string,
  size: number,
  senderName?: string,
}

export type Connections = { [senderDID: string]: Connection }

export type ConnectionStore = {
  // TODO:PS Add specific keys in connection store
  [string]: any,
  data: ?Connections,
}

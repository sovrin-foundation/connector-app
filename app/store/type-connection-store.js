// @flow
import type { InvitationPayload } from '../invitation/type-invitation'

export type Connection = {
  identifier: string,
  logoUrl: string,
  senderDID: string,
  senderEndpoint: string,
  size: number,
  senderName?: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  myPairwiseAgentDid: string,
  myPairwiseAgentVerKey: string,
  myPairwisePeerVerKey: string,
}

export type Connections = { [senderDID: string]: Connection }

export type ConnectionStore = {
  // TODO:PS Add specific keys in connection store
  [string]: any,
  data: ?Connections,
}

export const NEW_CONNECTION = 'NEW_CONNECTION'

export type NewConnectionAction = {
  type: typeof NEW_CONNECTION,
  connection: {
    identifier: string,
    logoUrl?: ?string,
  } & InvitationPayload,
}

// @flow
import type { InvitationPayload } from '../invitation/type-invitation'
import type { CustomError } from '../common/type-common'

export type MyPairwiseInfo = {
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  myPairwiseAgentDid: string,
  myPairwiseAgentVerKey: string,
  myPairwisePeerVerKey: string,
  senderDID: string,
}

export type Connection = {
  identifier: string,
  logoUrl: string,
  senderEndpoint: string,
  size?: number,
  senderName?: string,
  vcxSerializedConnection: string,
} & MyPairwiseInfo

export const DELETE_CONNECTION = 'DELETE_CONNECTION'

export type DeleteConnectionEventAction = {
  type: typeof DELETE_CONNECTION,
  senderDID: string,
}

export type Connections = { [senderDID: string]: Connection }

export type ConnectionStore = {
  // TODO:PS Add specific keys in connection store
  [string]: any,
  data: ?Connections,
}

export const DELETE_CONNECTION_SUCCESS = 'DELETE_CONNECTION_SUCCESS'

export const DELETE_CONNECTION_FAILURE = 'DELETE_CONNECTION_FAILURE'

export type DeleteConnectionSuccessEventAction = {
  type: typeof DELETE_CONNECTION_SUCCESS,
  filteredConnections: Connections,
}

export type DeleteConnectionFailureEventAction = {
  type: typeof DELETE_CONNECTION_FAILURE,
  connection: Connection,
  error: CustomError,
}

export const NEW_CONNECTION = 'NEW_CONNECTION'

export type NewConnectionAction = {
  type: typeof NEW_CONNECTION,
  connection: {
    identifier: string,
    logoUrl?: ?string,
  } & InvitationPayload,
}

export const STORAGE_KEY_THEMES = 'STORAGE_KEY_THEMES'

export type ConnectionThemes = {
  [string]: {
    primary: string,
    secondary: string,
  },
}

export const HYDRATE_CONNECTION_THEMES = 'HYDRATE_CONNECTION_THEMES'

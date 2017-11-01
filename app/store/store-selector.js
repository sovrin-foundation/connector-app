// @flow
import type { Store, Connections, Connection } from './type-store'

export const getConfig = (state: Store) => state.config

export const getAgencyUrl = (state: Store) => state.config.agencyUrl

export const getPushToken = (state: Store) => state.pushNotification.pushToken

export const getSMSToken = (state: Store) => state.deepLink.token

export const getAllConnection = (state: Store) => state.connections.data

export const getSmsInvitationPayload = (state: Store) =>
  state.smsPendingInvitation.payload

export const getConnectionTheme = (state: Store, logoUrl: string) =>
  state.connections.connectionThemes[logoUrl] ||
  state.connections.connectionThemes['default']

export const getErrorAlertsSwitchValue = (state: Store) =>
  state.config.showErrorAlerts

export const getInvitationPayload = (
  state: Store,
  invitationSenderDID: string
) => state.invitation[invitationSenderDID].payload

export const isDuplicateConnection = (state: Store, senderDID: string) => {
  const connections = getAllConnection(state)
  if (connections) {
    // Had to use `any` type here even though we know `Array<Connection>`
    // will be returned, as of now Flow returns mixed type for
    // all Object.{map,keys,values} operations and we can't do
    // anything unless we specify $Exact type, which we can't define
    // in this case, because for $Exact type, we should know each
    // key in advance which is not the case here because we don't know DIDs
    // with which we will make connections
    const savedConnections: Array<any> = Object.values(connections)
    return (
      savedConnections.filter(
        (connection: Connection) => connection.senderDID === senderDID
      ).length > 0
    )
  } else {
    return false
  }
}

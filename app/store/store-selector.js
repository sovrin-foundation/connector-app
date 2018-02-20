// @flow
import type { Store } from './type-store'
import type { ClaimOfferPayload } from '../claim-offer/type-claim-offer'
import type { Connections, Connection } from './type-connection-store'
import type { ConnectionHistoryEvent } from '../connection-history/type-connection-history'

export const getConfig = (state: Store) => state.config

export const getAgencyUrl = (state: Store) => state.config.agencyUrl

export const getAgencyDID = (state: Store) => state.config.agencyDID

export const getPoolConfig = (state: Store) => state.config.poolConfig

export const getAgencyVerificationKey = (state: Store) =>
  state.config.agencyVerificationKey

export const getPushToken = (state: Store) => state.pushNotification.pushToken

export const getAllConnection = (state: Store) => state.connections.data

export const getConnectionTheme = (state: Store, logoUrl: string) =>
  state.connections.connectionThemes[logoUrl] ||
  state.connections.connectionThemes['default']

export const getErrorAlertsSwitchValue = (state: Store) =>
  state.config.showErrorAlerts

export const getInvitationPayload = (
  state: Store,
  invitationSenderDID: string
) => state.invitation[invitationSenderDID].payload

export const getConnectionLogoUrl = (
  state: Store,
  remotePairwiseDid: string
): string => {
  const { logoUrl } = getConnection(state, remotePairwiseDid)[0]

  return logoUrl
}

const getConnection = (state: Store, senderDID: string): Array<Connection> => {
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
    return savedConnections.filter(
      (connection: Connection) => connection.senderDID === senderDID
    )
  }

  return []
}

export const isDuplicateConnection = (state: Store, senderDID: string) => {
  const connections = getConnection(state, senderDID)

  return connections.length > 0
}

export const getHydrationState = (state: Store) => state.config.isHydrated

export const getClaimOffer = (state: Store, claimOfferId: string) =>
  state.claimOffer[claimOfferId]

//TODO - delete this selector and handle it in the reducer (no need to filter twice)
export const getPendingHistoryEvent = (
  state: Store,
  claim: ClaimOfferPayload
) => {
  const historyItems =
    state.history && state.history.data
      ? state.history.data[claim.remotePairwiseDID]
      : []
  return historyItems.filter(item => {
    return item.action === 'PENDING' && item.originalPayload.uid === claim.uid
  })[0]
}

export const getProofRequest = (state: Store, proofRequestId: string) =>
  state.proofRequest[proofRequestId]

export const getProofRequesterName = (state: Store, proofRequestId: string) => {
  if (
    state.proofRequest[proofRequestId] &&
    state.proofRequest[proofRequestId].requester &&
    state.proofRequest[proofRequestId].requester.name
  ) {
    return state.proofRequest[proofRequestId].requester.name
  }
  return 'requester'
}
export const getOriginalProofRequestData = (
  state: Store,
  proofRequestId: string
) => state.proofRequest[proofRequestId].originalProofRequestData

export const getProofRequestPairwiseDid = (
  state: Store,
  proofRequestId: string
) => state.proofRequest[proofRequestId].remotePairwiseDID

export const getProof = (state: Store, proofRequestId: string) =>
  state.proof[proofRequestId]

export const getUserPairwiseDid = (state: Store, senderDID: string) => {
  const connections = getConnection(state, senderDID)
  if (connections.length > 0) {
    return connections[0].identifier
  }

  return null
}

export const getRemotePairwiseDidAndName = (state: Store, userDid: string) => {
  if (state.connections.data) {
    const connection = state.connections.data[userDid]
    if (connection) {
      return {
        remotePairwiseDID: connection.senderDID,
        remoteName: connection.senderName,
        ...connection,
      }
    }

    return {}
  }

  return {}
}

export const getUserOneTimeInfo = (state: Store) => state.user.userOneTimeInfo

export const getClaimIssuerLogo = (state: Store, claimUuid: string) => {
  const senderDID = state.connections.claimMap[claimUuid]
  return getConnectionLogoUrl(state, senderDID)
}

export const getCurrentScreen = (state: Store) => state.route.currentScreen

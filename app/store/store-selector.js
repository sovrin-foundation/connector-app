// @flow
import type { Store } from './type-store'
import type { ClaimOfferStore } from '../claim-offer/type-claim-offer'
import type { ProofRequestStore } from '../proof-request/type-proof-request'
import type {
  ClaimOfferPayload,
  SerializedClaimOffersPerDid,
} from '../claim-offer/type-claim-offer'
import type { Connections, Connection } from './type-connection-store'
import type { ConnectionHistoryEvent } from '../connection-history/type-connection-history'
import RNFetchBlob from 'react-native-fetch-blob'
import { Platform } from 'react-native'
import { whiteSmoke } from '../common/styles/constant'
import memoize from 'lodash.memoize'
import { CLAIM_OFFER_STATUS } from './../claim-offer/type-claim-offer'
import { PROOF_REQUEST_STATUS } from './../proof-request/type-proof-request'

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

export const getConnection = (
  state: Store,
  senderDID: string
): Array<Connection> => {
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

export const getInitializedState = (state: Store) => state.config.isInitialized

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

export const getHistoryEvent = (
  state: Store,
  uid: string,
  remoteDid: string,
  type: string
) => {
  const historyItems =
    state.history && state.history.data ? state.history.data[remoteDid] : []
  return historyItems.filter(item => {
    return (
      item.originalPayload &&
      item.originalPayload.type === type &&
      item.originalPayload.payloadInfo &&
      item.originalPayload.payloadInfo.uid === uid
    )
  })[0]
}

export const getPendingHistory = (
  state: Store,
  uid: string,
  remoteDid: string,
  type: string
) => {
  const historyItems =
    state.history && state.history.data ? state.history.data[remoteDid] : []
  return historyItems.filter(item => {
    return (
      item.originalPayload &&
      item.originalPayload.type === type &&
      item.originalPayload.uid === uid
    )
  })[0]
}

export const getClaimReceivedHistory = (
  state: Store,
  uid: string,
  remoteDid: string,
  type: string
) => {
  const historyItems =
    state.history && state.history.data ? state.history.data[remoteDid] : []
  return historyItems.filter(item => {
    return (
      item.originalPayload &&
      item.originalPayload.type === type &&
      item.originalPayload.messageId === uid
    )
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
export const getProofRequests = (state: Store) => state.proofRequest

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

export const getClaimMap = (state: Store) => state.claim.claimMap

export const getCurrentScreen = (state: Store) => state.route.currentScreen

export const getWalletBalance = (state: Store) =>
  state.wallet.walletBalance.data

export const getWalletAddresses = (state: Store) =>
  state.wallet.walletAddresses.data

export const getTokenAmount = (state: Store) => state.wallet.payment.tokenAmount

export const getWalletHistory = (state: Store) => state.wallet.walletHistory

export const getStatusBarTheme = (state: Store) => {
  const statusBarTheme =
    state.connections !== undefined &&
    state.connections.statusBarTheme != undefined
      ? state.connections.statusBarTheme
      : whiteSmoke
  return statusBarTheme
}

export const getUserAvatarSource = (name: ?string) => {
  if (name) {
    const uri =
      Platform.OS === 'ios'
        ? `${RNFetchBlob.fs.dirs.DocumentDir}/${name}`
        : `file://${RNFetchBlob.fs.dirs.DocumentDir}/${name}`
    return {
      uri,
    }
  }

  return undefined
}

export const getUserAvatarName = (state: Store) => state.user.avatarName

export const getThemes = (state: Store) => state.connections.connectionThemes

export const getVcxInitializationState = (state: Store) =>
  state.config.vcxInitializationState

export const getIsLockEnabledState = (state: Store) => state.lock.isLockEnabled
export const getIsAppLocked = (state: Store) => state.lock.isAppLocked

export const getIsAlreadyInstalledState = (state: Store) =>
  state.config.isAlreadyInstalled

export const getClaimOffers = (state: Store) => state.claimOffer

export const getSerializedClaimOffer = (
  state: Store,
  userDID: string,
  messageId: string
) => {
  const userClaimOffers = state.claimOffer.vcxSerializedClaimOffers[userDID]
  if (!userClaimOffers) {
    // we did not find any claim offers with user pairwise did (userDID)
    return null
  }

  return userClaimOffers[messageId]
}

export const getSerializedClaimOffers = (state: Store, userDID: string) => {
  const serializedClaimOffers: SerializedClaimOffersPerDid =
    state.claimOffer.vcxSerializedClaimOffers[userDID]

  if (serializedClaimOffers) {
    return Object.values(serializedClaimOffers)
  }

  return []
}

export const getAllConnectionsPairwiseDid = (state: Store) => {
  const connections = getAllConnection(state)

  if (connections) {
    return Object.keys(connections).map(
      userDID => connections[userDID].myPairwiseDid
    )
  }
  return null
}

export const getConnectionByUserDid = (state: Store, userDID: string) => {
  const connections = getAllConnection(state)

  if (connections) {
    return connections[userDID]
  }

  return null
}

export const getInvitations = (state: Store) => state.invitation

export const getDeepLinkTokens = (state: Store) => state.deepLink.tokens

export const getBackupPassphrase = (state: Store) => state.backup.passphrase

export const getBackupStatus = (state: Store) => state.backup.status

export const getBackupWalletPath = (state: Store) =>
  state.backup.backupWalletPath

export const getBackupShowBanner = (state: Store) => state.backup.showBanner

const addUidsWithStatusToConnections = (
  events: ProofRequestStore | ClaimOfferStore,
  filterStatus,
  obj
) => {
  ;(Object.keys(events): Array<string>).map(uid => {
    if (events[uid].status === filterStatus) {
      const remoteDid: string = events[uid].remotePairwiseDID
      obj[remoteDid] = obj[remoteDid] || []
      obj[remoteDid].push(uid)
    }
  })
}

//  getUnseenMessages should take a connection, and parse though claim store and proof requests for unseen messages and return a json object like bellow.
export const getUnseenMessages = memoize(
  (state: Store) => {
    const { claimOffer, proofRequest } = state
    let obj = {}

    addUidsWithStatusToConnections(claimOffer, CLAIM_OFFER_STATUS.RECEIVED, obj)
    addUidsWithStatusToConnections(
      proofRequest,
      PROOF_REQUEST_STATUS.RECEIVED,
      obj
    )
    return obj
  },
  ({ claimOffer, proofRequest }) => ({
    ...claimOffer,
    ...proofRequest,
  })
)

export const getLastSuccessfulBackupTimeStamp = (state: Store) =>
  state.backup.lastSuccessfulBackup

export const getRestoreStatus = (state: Store) => state.restore.status

export const getRestoreFileSize = (state: Store) =>
  state.restore.restoreFile.fileSize

export const getRouteCurrentScreen = (state: Store) => state.route.currentScreen

export const getRestoreFilePath = (state: Store) =>
  state.restore.restoreFile.uri

export const getRestoreFileName = (state: Store) =>
  state.restore.restoreFile.fileName

export const getSalt = (state: Store) => state.backup.passphrase.salt

export const getHistory = (state: Store) => state.history.data
export const getPendingFetchAdditionalDataKey = (state: Store) =>
  state.pushNotification.pendingFetchAdditionalDataKey

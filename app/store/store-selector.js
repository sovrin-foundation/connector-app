// @flow
import type { Store } from './type-store'

export const getConfig = (state: Store) => state.config

export const getAgencyUrl = (state: Store) => state.config.agencyUrl

export const getPushToken = (state: Store) => state.pushNotification.pushToken

export const getQrPayload = (state: Store) => state.qrConnection.payload

export const getSMSToken = (state: Store) => state.deepLink.token

export const getSMSRemoteConnectionId = (state: Store) =>
  state.smsConnection.payload.remoteConnectionId

export const getAllConnection = (state: Store) => state.connections.data

export const getSenderGeneratedUserDidSMSRequest = (state: Store) =>
  state.smsConnection.payload.payload.pairwiseDID

export const getSMSConnectionRequestId = (state: Store) =>
  state.smsConnection.payload.payload.uid

export const getSMSConnectionRequestRemoteDID = (state: Store) =>
  state.smsConnection.payload.payload.remoteDID

export const getConnectionTheme = (state: Store, logoUrl: string) =>
  state.connections.connectionThemes[logoUrl] ||
  state.connections.connectionThemes['default']

export const getErrorAlertsSwitchValue = (state: Store) =>
  state.config.showErrorAlerts

// @flow
import type { Store } from './type-store'

export const getConfig = (state: Store) => state.config

export const getAgencyUrl = (state: Store) => state.config.agencyUrl

export const getPushToken = (state: Store) => state.pushNotification.pushToken

export const getQrPayload = (state: Store) => state.qrConnection.payload

export const getSMSToken = (state: Store) => state.deepLink.token

export const getSMSRemoteConnectionId = (state: Store) =>
  state.smsConnection.payload.remoteConnectionId

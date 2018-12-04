// @flow
export const OFFLINE_STATUS = 'OFFLINE_STATUS'

export type OfflineStore = {
  offline: boolean,
}

export type OfflineActions = OfflineStatus

export type OfflineStatus = {
  type: typeof OFFLINE_STATUS,
  offline: boolean,
}

export type OfflineProps = {
  overlay?: boolean,
  isOffline: boolean,
  offline: (offline: boolean) => void,
  render?: (isConnected: ?boolean) => any,
}

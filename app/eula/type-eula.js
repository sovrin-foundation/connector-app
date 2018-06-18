// @flow
export const EULA_ACCEPT = 'EULA_ACCEPT'
export const STORAGE_KEY_EULA_ACCEPTANCE = 'STORAGE_KEY_EULA_ACCEPTANCE'

export type EulaStore = {
  isEulaAccept: boolean,
}

export type EulaActions = EulaAccept

export type EulaAccept = {
  type: typeof EULA_ACCEPT,
  isEulaAccept: boolean,
}

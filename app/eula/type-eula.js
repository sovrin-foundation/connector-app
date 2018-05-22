// @flow
export const EULA_ACCEPT = 'EULA_ACCEPT'

export type EulaStore = {
  isEulaAccept: boolean,
}

export type EulaActions = EulaAccept

export type EulaAccept = {
  type: typeof EULA_ACCEPT,
  isEulaAccept: boolean,
}

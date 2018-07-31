// @flow
import { Platform } from 'react-native'

export const EULA_ACCEPT = 'EULA_ACCEPT'
export const ANDROID_EULA_URL = 'https://www.connect.me/google.html'
export const IOS_EULA_URL = 'https://www.connect.me/ios_eula.html'
export const EULA_URL =
  Platform.OS === 'android' ? ANDROID_EULA_URL : IOS_EULA_URL
export const STORAGE_KEY_EULA_ACCEPTANCE = 'STORAGE_KEY_EULA_ACCEPTANCE'
export const HYDRATE_EULA_ACCEPT = 'HYDRATE_EULA_ACCEPT'

export type EulaStore = {
  isEulaAccept: boolean,
}

export type EulaActions = EulaAccept | HydrateEulaAcceptAction

export type EulaAccept = {
  type: typeof EULA_ACCEPT,
  isEulaAccept: boolean,
}

export type HydrateEulaAcceptAction = {
  type: typeof HYDRATE_EULA_ACCEPT,
  isEulaAccept: boolean,
}

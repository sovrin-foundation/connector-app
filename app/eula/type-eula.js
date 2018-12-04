// @flow
import type { CustomError } from '../common/type-common'
import { Platform } from 'react-native'

const isAndroid = Platform.OS === 'android'
export const EULA_ACCEPT = 'EULA_ACCEPT'
export const ANDROID_EULA_URL = 'https://www.connect.me/google.html'
export const IOS_EULA_URL = 'https://www.connect.me/ios_eula.html'
export const EULA_URL = isAndroid ? ANDROID_EULA_URL : IOS_EULA_URL
export const localEulaSource = isAndroid
  ? 'file:///android_asset/external/connectme/eula_android.html'
  : './eula_ios.html'
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

export type EulaScreenState = {
  error: null | CustomError,
}

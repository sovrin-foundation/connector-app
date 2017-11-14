// @flow
import RNSensitiveInfo from 'react-native-sensitive-info'

const storageName = {
  sharedPreferencesName: 'ConnectMeSharedPref',
  keyNamechainService: 'ConnectMeKeyChain',
}

export const setItem = (key: string, data: string) =>
  RNSensitiveInfo.setItem(key, data, storageName)

export const getItem = (key: string) =>
  RNSensitiveInfo.getItem(key, storageName)

export const deleteItem = (key: string) =>
  RNSensitiveInfo.deleteItem(key, storageName)

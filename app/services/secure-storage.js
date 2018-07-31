// @flow
import RNSensitiveInfo from 'react-native-sensitive-info'
import {
  setWalletItem,
  getWalletItem,
  deleteWalletItem,
} from '../bridge/react-native-cxs/RNCxs'

const storageName = {
  sharedPreferencesName: 'ConnectMeSharedPref',
  keychainService: 'ConnectMeKeyChain',
}

export const setItem = (key: string, data: string) =>
  RNSensitiveInfo.setItem(key, data, storageName)

export const getItem = (key: string) =>
  RNSensitiveInfo.getItem(key, storageName)

export const deleteItem = (key: string) =>
  RNSensitiveInfo.deleteItem(key, storageName)

export const setWalletRecordItem = (key: string, data: string) =>
  setWalletItem(key, data)

export const getWalletRecordItem = (key: string) => getWalletItem(key)

export const deleteWalletRecordItem = (key: string) => deleteWalletItem(key)

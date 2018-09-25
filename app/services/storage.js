// @flow
import { AsyncStorage } from 'react-native'
import { call, select } from 'redux-saga/effects'
import RNSensitiveInfo from 'react-native-sensitive-info'
import {
  setWalletItem,
  getWalletItem,
  deleteWalletItem,
  updateWalletItem,
  vcxShutdown,
} from '../bridge/react-native-cxs/RNCxs'
import { captureError } from './error/error-handler'
import { IN_RECOVERY } from '../lock/type-lock'

const storageName = {
  sharedPreferencesName: 'ConnectMeSharedPref',
  keychainService: 'ConnectMeKeyChain',
}

// SECURE STORAGE
export const secureSet = (key: string, data: string) =>
  RNSensitiveInfo.setItem(key, data, storageName)

export const secureGet = async (key: string) => {
  const data = await RNSensitiveInfo.getItem(key, storageName)

  return data
}

export const secureGetAll = () => RNSensitiveInfo.getAllItems(storageName)

export const secureDelete = (key: string) =>
  RNSensitiveInfo.deleteItem(key, storageName)

export const getStackTrace = () => {
  var obj = {}
  Error.captureStackTrace(obj, getStackTrace)
  return obj.stack
}

// WALLET STORAGE
export const walletSet = async (key: string, data: string) => {
  try {
    await setWalletItem(key, data)
  } catch (err) {
    captureError(err)
    try {
      // if add item fails, try update item
      await walletUpdate(key, data)
    } catch (e) {
      captureError(e)
      // need to think about what happens if storage fails
      console.log(`Storage fails: key: ${key}, Error: ${e}`)
    }
  }
}

export const walletGet = async (key: string) => {
  try {
    const data = await getWalletItem(key)
    return data
  } catch (e) {
    captureError(e)
    console.log(`walletGet: key: ${key}, Error: ${e}`)
    return null
  }
}

export const walletDelete = async (key: string) => {
  try {
    const del = await deleteWalletItem(key)
    return del
  } catch (e) {
    captureError(e)
  }
}

export async function walletUpdate(key: string, data: string) {
  try {
    await updateWalletItem(key, data)
  } catch (err) {
    captureError(err)
    console.log(
      'walletUpdate error :: key: ' + key + ' :: data: ' + data + ' :: err: ',
      err
    )
  }
}

// NON-SECURE STORAGE
export const safeSet = (key: string, data: string) =>
  AsyncStorage.setItem(key, data)

export const safeGet = (key: string) => AsyncStorage.getItem(key)

export const safeDelete = (key: string) => AsyncStorage.removeItem(key)

export const safeMultiRemove = (keys: string[]) =>
  AsyncStorage.multiRemove(keys)

// GET ITEM USED FOR HYDRATION METHODS
export const getHydrationItem = async (key: string) => {
  let inRecovery: string = await safeGet(IN_RECOVERY)

  if (inRecovery === 'true') {
    const walletItem = await walletGet(key)

    return walletItem
  } else {
    const secureItem = secureGet(key)

    return secureItem
  }
}

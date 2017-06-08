import RNSensitiveInfo from 'react-native-sensitive-info'

const storageName = {
  sharedPreferencesName: 'ConnectMeSharedPref',
  keyNamechainService: 'ConnectMeKeyChain',
}

export const setItem = (key, data) =>
  RNSensitiveInfo.setItem(key, data, storageName)

export const getItem = key => RNSensitiveInfo.getItem(key, storageName)

export const deleteItem = key => RNSensitiveInfo.deleteItem(key, storageName)

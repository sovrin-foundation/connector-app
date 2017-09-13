import { NativeModules } from 'react-native'

const { RNIndy } = NativeModules

export const createWalletWithPoolName = (
  poolName,
  name,
  type,
  config,
  credentials
) => RNIndy.createWalletWithPoolName(poolName, name, type, config, credentials)

export default {
  WALLET: RNIndy.WALLET,
}

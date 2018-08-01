// @flow
import Aes from 'react-native-aes-crypto'
import { NativeModules, Platform } from 'react-native'

const { RNRandomBytes } = NativeModules

const generateKey = (password: string, salt: string) =>
  Aes.pbkdf2(password, salt)

export const generateSalt = async () => {
  const numBytes = 32
  return new Promise(function(resolve, reject) {
    RNRandomBytes.randomBytes(numBytes, (err: any, bytes: string) => {
      if (err) {
        reject(err)
      } else {
        if (Platform.OS === 'android') {
          resolve(bytes.slice(0, -1))
        } else {
          resolve(bytes)
        }
      }
    })
  })
}

export async function pinHash(pin: string, salt: string) {
  try {
    const key = await generateKey(pin, salt)
    if (__DEV__) {
      console.log('pinHash: salt: ', salt)
      console.log('pinHash: key: ', key)
    }
    //TODO: This is hack due to android
    return key.substring(0, 16)
  } catch (e) {
    console.error(`pinHash: ${e}`)
    return null
  }
}

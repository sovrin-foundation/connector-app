// @flow
import PBKDF2 from 'react-native-pbkdf2'
import { NativeModules, Platform } from 'react-native'
import { captureError } from '../services/error/error-handler'

const { RNRandomBytes } = NativeModules

const generateKey = (password: string, salt: string) =>
  PBKDF2.derivationKey(password, salt, 1000)

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
    captureError(new Error(`pinHash: ${e}`))
    return null
  }
}

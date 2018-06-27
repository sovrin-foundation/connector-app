// @flow
import Aes from 'react-native-aes-crypto'
import { NativeModules } from 'react-native'
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
        resolve(bytes)
      }
    })
  })
}

export async function pinHash(pin: string, salt: string) {
  try {
    var key = await generateKey(pin, salt)
    if (__DEV__) {
      console.log('salt', salt)
      console.log('key', key)
    }
    return key
  } catch (e) {
    console.error(e)
    return null
  }
}

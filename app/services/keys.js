// @flow
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import randomString from 'random-string'

const decodeUTF8 = s => {
  if (typeof s !== 'string') throw new TypeError('expected string')
  var i, d = unescape(s), b = new Uint8Array(d.length)
  for (i = 0; i < d.length; i++) {
    b[i] = d.charCodeAt(i)
  }
  var i, d = unescape(s), b = new Uint8Array(d.length)
  for (i = 0; i < d.length; i++) {
    b[i] = d.charCodeAt(i)
  }
  return b
}

// TODO: need to change the name of secretKey to privateKey or signing key by default
// secretKey means symmetric encryption key, but we are doing ed25519
// naming it this way makes this confusing
export const getKeyPairFromSeed = (seed: string) =>
  nacl.sign.keyPair.fromSeed(decodeUTF8(seed))

export const getSignature = (secretKey: any, message: string) =>
  nacl.sign.detached(decodeUTF8(message), secretKey)

export const verifySignature = (
  signature: string,
  publicKey: any,
  message: string
) => nacl.sign.detached.verify(decodeUTF8(message), signature, publicKey)

export const randomSeed = (length: number) =>
  bs58.encode(randomString({ length, letters: false }))

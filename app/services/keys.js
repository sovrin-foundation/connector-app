import nacl from 'tweetnacl'
import bs58 from 'bs58'

const decodeUTF8 = s => {
  if (typeof s !== 'string') throw new TypeError('expected string')
  var i, d = unescape(s), b = new Uint8Array(d.length)
  for (i = 0; i < d.length; i++)
    b[i] = d.charCodeAt(i)
  return b
}

export const getKeyPairFromSeed = seed =>
  nacl.sign.keyPair.fromSeed(decodeUTF8(seed))

export const getSignature = (secretKey, message) =>
  nacl.sign.detached(decodeUTF8(message), secretKey)

export const verifySignature = (signature, publicKey, message) =>
  nacl.sign.detached.verify(decodeUTF8(message), signature, publicKey)

export const randomSeed = length => bs58.encode(nacl.randomBytes(length))

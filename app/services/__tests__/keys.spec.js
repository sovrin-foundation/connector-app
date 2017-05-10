import { getKeyPairFromSeed } from '../keys'
import bs58 from 'bs58'

const keys = getKeyPairFromSeed('11111111111111111111111111111111')

describe('Key generation and validation', () => {
  it('should return key-pairs', () => {
    expect(keys).not.toBeNull()
  })

  it('should match public-private key pair', () => {
    const { publicKey, secretKey } = keys
    const base58PublicKey = bs58.encode(publicKey)
    const base58SecretKey = bs58.encode(secretKey)
    expect(base58PublicKey).toEqual(
      '5rArie7XKukPCaEwq5XGQJnM9Fc5aZE3M9HAPVfMU2xC'
    )
    expect(base58SecretKey).toEqual(
      'z3XN8ZK368b5Fps5CjyZJBNdF81zEUCJzwyDn3BnwqGJiiDSTnwrsHFmLiJdGaaK9NCtAVP3198cdxuLoMnUZkQ'
    )
  })
})

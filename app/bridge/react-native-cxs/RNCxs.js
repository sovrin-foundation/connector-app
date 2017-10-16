// @flow
import {
  getKeyPairFromSeed,
  getSignature,
  verifySignature,
  randomSeed,
} from '../../services'
import { encode } from 'bs58'
import { AsyncStorage } from 'react-native'

type Connection = {
  metadata: string,
  seed: string,
  identifier: string,
}

const savedConnectionKey = '@ConnectMe:SavedConnectionKey'

let connections: { [string]: Connection } = {}

async function get() {
  try {
    const storedConnections = await AsyncStorage.getItem(savedConnectionKey)
    if (storedConnections) {
      connections = JSON.parse(storedConnections)
    }
  } catch (e) {
    console.log(e)
  }
}

async function save() {
  try {
    await AsyncStorage.setItem(savedConnectionKey, JSON.stringify(connections))
  } catch (e) {
    console.log(e)
  }
}

// add arbitrary delay to make functions async
const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms))

export async function encrypt(remoteDid: string, payload: string) {
  if (Object.keys(connections).length === 0) {
    await get()
  }
  const { seed } = connections[remoteDid]
  const { secretKey } = getKeyPairFromSeed(seed)
  const signature = encode(getSignature(secretKey, payload))

  await wait()

  return signature
}

export async function decrypt(remoteDid: string, payload: string) {
  await wait()

  return payload
}

export async function addConnection(
  remoteDid: string,
  metadata: string = '{}'
) {
  const identifier = randomSeed(32).substring(0, 22)
  const seed = randomSeed(32).substring(0, 32)
  const { publicKey } = getKeyPairFromSeed(seed)
  connections[remoteDid] = {
    seed,
    identifier,
    metadata,
  }

  await wait()
  await save()

  return {
    identifier,
    verificationKey: encode(publicKey),
  }
}

export async function getConnectionMetadata(remoteDid: string) {
  await wait()

  return connections[remoteDid].metadata
}

export async function getClaimRequest(remoteDid: string, claimOffer: string) {}

export async function addClaim(remoteDid: string, claim: string) {}

export async function getClaim(claimUuid: string) {}

export async function prepareProof(proofRequest: string) {}

export async function generateProof(
  remoteDid: string,
  preparedClaimsProof: string
) {}

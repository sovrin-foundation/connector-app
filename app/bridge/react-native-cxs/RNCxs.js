// @flow
import {
  getKeyPairFromSeed,
  getSignature,
  verifySignature,
  randomSeed,
} from '../../services'
import { encode } from 'bs58'
import { AsyncStorage } from 'react-native'
import { NativeModules } from 'react-native'

// get React native indy module from NativeModules
const { RNIndy } = NativeModules

type Metadata = {
  [string]: string,
}

type Connection = {
  metadata: Metadata,
  seed: string,
  identifier?: string,
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

  try {
    const metadataJson = await RNIndy.getConnectionForDid(remoteDid)
    const metadata = JSON.parse(metadataJson)
  } catch (e) {
    // what to do with indy error and how to handle them
    console.error(e)
  }

  return signature
}

export async function decrypt(remoteDid: string, payload: string) {
  await wait()

  return payload
}

export async function addConnection(
  remoteDid: string,
  metadata: Metadata = {}
) {
  const seed = randomSeed(32).substring(0, 32)
  const { publicKey } = getKeyPairFromSeed(seed)
  const verificationKey = encode(publicKey)

  let identifier
  try {
    const pairwiseInfo = await RNIndy.addConnection(
      remoteDid,
      verificationKey,
      {
        seed,
        ...metadata,
      }
    )

    try {
      const pairwise = JSON.parse(pairwiseInfo)
      identifier = pairwise.userDID
    } catch (e) {
      // what to do if indy-sdk doesn't give user did
      console.error(e)
    }
  } catch (e) {
    // what to do if indy sdk returns error
    console.error(e)
  }

  connections[remoteDid] = {
    seed,
    identifier,
    metadata,
  }

  await save()

  return {
    identifier,
    verificationKey,
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

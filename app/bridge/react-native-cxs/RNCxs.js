// @flow
import { NativeModules } from 'react-native'
import type { Metadata, IndyClaimOffer } from './type-cxs'

// get React native indy module from NativeModules
const { RNIndy } = NativeModules

// add arbitrary delay to make functions async
const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms))

export async function encrypt(remoteDid: string, payload: string) {
  try {
    const metadataJson = await RNIndy.getConnectionForDid(remoteDid)
    const metadata = JSON.parse(metadataJson)
  } catch (e) {
    // what to do with indy error and how to handle them
    console.error(e)
  }

  return payload
}

export async function decrypt(remoteDid: string, payload: string) {
  await wait()

  return payload
}

export async function addConnection(
  remoteDid: string,
  senderVerificationKey: string,
  metadata: Metadata = {}
) {
  let identifier
  let verificationKey
  try {
    const pairwiseInfo = await RNIndy.addConnection(
      remoteDid,
      senderVerificationKey,
      {
        ...metadata,
      }
    )

    try {
      const pairwise = JSON.parse(pairwiseInfo)
      identifier = pairwise.userDID
      verificationKey = pairwise.verificationKey
    } catch (e) {
      // what to do if indy-sdk doesn't give user did
      console.error(e)
    }
  } catch (e) {
    // what to do if indy sdk returns error
    console.error(e)
  }

  // TODO: What if Indy throws error and we don't get any DID
  return {
    identifier,
    verificationKey,
  }
}

export async function getConnectionMetadata(remoteDid: string) {
  await wait()

  return { remoteDid }
}

export async function generateClaimRequest(
  remoteDid: string,
  claimOffer: IndyClaimOffer
) {
  const indyClaimOffer = {
    issuer_did: claimOffer.issuerDid,
    schema_seq_no: claimOffer.schemaSequenceNumber,
  }

  const claimRequest: string = await RNIndy.generateClaimRequest(
    remoteDid,
    JSON.stringify(indyClaimOffer)
  )

  return claimRequest
}

export async function addClaim(claim: string) {
  return await RNIndy.addClaim(claim)
}

export async function getClaim(claimUuid: string) {}

export async function prepareProof(proofRequest: string) {
  const prepareProofJSON: string = await RNIndy.prepareProof(proofRequest)
  return prepareProofJSON
}

export async function generateProof(
  proofRequest: string,
  remoteDid: string,
  prepareProof: string,
  requestedClaims: string
) {
  const proof: string = await RNIndy.getProof(
    proofRequest,
    remoteDid,
    prepareProof,
    requestedClaims
  )
  return proof
}

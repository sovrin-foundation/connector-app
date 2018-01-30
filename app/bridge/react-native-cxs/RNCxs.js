// @flow
import { NativeModules } from 'react-native'
import type {
  Metadata,
  IndyClaimOffer,
  ConnectAgencyResponse,
  RegisterAgencyResponse,
  CreateOneTimeAgentResponse,
  CreatePairwiseAgentResponse,
  AcceptInvitationResponse,
} from './type-cxs'
import type { InvitationPayload } from '../../invitation/type-invitation'

// get React native indy module from NativeModules
const { RNIndy } = NativeModules

export async function addConnection(
  remoteDid: string,
  senderVerificationKey: string,
  metadata: Metadata = {},
  poolConfig: string
) {
  let identifier
  let verificationKey
  try {
    const pairwiseInfo = await RNIndy.addConnection(
      remoteDid,
      senderVerificationKey,
      {
        ...metadata,
      },
      poolConfig ? poolConfig.split('\\n').join('\n') : null
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

export async function getClaim(filterJSON: string) {
  return await RNIndy.getClaim(JSON.stringify(filterJSON))
}

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

export async function connectToAgency({
  url,
  myDid,
  agencyDid,
  myVerKey,
  agencyVerKey,
}: {
  url: string,
  myDid: string,
  agencyDid: string,
  myVerKey: string,
  agencyVerKey: string,
}) {
  const connectResponse: ConnectAgencyResponse = await RNIndy.connectToAgency(
    url,
    myDid,
    agencyDid,
    myVerKey,
    agencyVerKey
  )

  return connectResponse
}

export async function registerWithAgency({
  url,
  oneTimeAgencyVerKey,
  oneTimeAgencyDid,
  myOneTimeVerKey,
  agencyVerKey,
}: {
  url: string,
  oneTimeAgencyVerKey: string,
  oneTimeAgencyDid: string,
  myOneTimeVerKey: string,
  agencyVerKey: string,
}) {
  const registerResponse: RegisterAgencyResponse = await RNIndy.signupWithAgency(
    url,
    oneTimeAgencyVerKey,
    oneTimeAgencyDid,
    myOneTimeVerKey,
    agencyVerKey
  )

  return registerResponse
}

export async function createOneTimeAgent({
  url,
  oneTimeAgencyVerKey,
  oneTimeAgencyDid,
  myOneTimeVerKey,
  agencyVerKey,
}: {
  url: string,
  oneTimeAgencyVerKey: string,
  oneTimeAgencyDid: string,
  myOneTimeVerKey: string,
  agencyVerKey: string,
}) {
  const createOneTimeAgentResponse: CreateOneTimeAgentResponse = await RNIndy.createOneTimeAgent(
    url,
    oneTimeAgencyVerKey,
    oneTimeAgencyDid,
    myOneTimeVerKey,
    agencyVerKey
  )

  return createOneTimeAgentResponse
}

export async function createPairwiseAgent({
  url,
  myPairwiseDid,
  myPairwiseVerKey,
  oneTimeAgentVerKey,
  oneTimeAgentDid,
  myOneTimeVerKey,
  agencyVerKey,
}: {
  url: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  oneTimeAgentVerKey: string,
  oneTimeAgentDid: string,
  myOneTimeVerKey: string,
  agencyVerKey: string,
}) {
  const createPairwiseAgentResponse: CreatePairwiseAgentResponse = await RNIndy.createPairwiseAgent(
    url,
    myPairwiseDid,
    myPairwiseVerKey,
    oneTimeAgentVerKey,
    oneTimeAgentDid,
    myOneTimeVerKey,
    agencyVerKey
  )

  return createPairwiseAgentResponse
}

export async function acceptInvitation({
  url,
  requestId,
  myPairwiseDid,
  myPairwiseVerKey,
  invitation,
  myPairwiseAgentDid,
  myPairwiseAgentVerKey,
  myOneTimeAgentDid,
  myOneTimeAgentVerKey,
  myOneTimeDid,
  myOneTimeVerKey,
  myAgencyVerKey,
}: {
  url: string,
  requestId: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  invitation: InvitationPayload,
  myPairwiseAgentDid: string,
  myPairwiseAgentVerKey: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerKey: string,
  myOneTimeDid: string,
  myOneTimeVerKey: string,
  myAgencyVerKey: string,
}) {
  const acceptInvitationResponse: AcceptInvitationResponse = await RNIndy.acceptInvitation(
    url,
    requestId,
    myPairwiseDid,
    myPairwiseVerKey,
    invitation,
    myPairwiseAgentDid,
    myPairwiseAgentVerKey,
    myOneTimeAgentDid,
    myOneTimeAgentVerKey,
    myOneTimeDid,
    myOneTimeVerKey,
    myAgencyVerKey
  )

  return acceptInvitationResponse
}

export async function updatePushToken({
  url,
  token,
  myOneTimeAgentDid,
  myOneTimeAgentVerKey,
  myOneTimeVerKey,
  myAgencyVerKey,
}: {
  url: string,
  token: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerKey: string,
  myOneTimeVerKey: string,
  myAgencyVerKey: string,
}) {
  return await RNIndy.updatePushToken(
    url,
    token,
    myOneTimeAgentDid,
    myOneTimeAgentVerKey,
    myOneTimeVerKey,
    myAgencyVerKey
  )
}

export async function getMessage({
  url,
  requestId,
  myPairwiseDid,
  myPairwiseVerKey,
  myPairwiseAgentDid,
  myPairwiseAgentVerKey,
  myOneTimeAgentDid,
  myOneTimeAgentVerKey,
  myOneTimeDid,
  myOneTimeVerKey,
  myAgencyVerKey,
}: {
  url: string,
  requestId: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  myPairwiseAgentDid: string,
  myPairwiseAgentVerKey: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerKey: string,
  myOneTimeDid: string,
  myOneTimeVerKey: string,
  myAgencyVerKey: string,
}) {
  return await RNIndy.getMessage(
    url,
    requestId,
    myPairwiseDid,
    myPairwiseVerKey,
    myPairwiseAgentDid,
    myPairwiseAgentVerKey,
    myOneTimeAgentDid,
    myOneTimeAgentVerKey,
    myOneTimeDid,
    myOneTimeVerKey,
    myAgencyVerKey
  )
}

export async function sendMessage({
  url,
  messageType,
  messageReplyId,
  message,
  myPairwiseDid,
  myPairwiseVerKey,
  myPairwiseAgentDid,
  myPairwiseAgentVerKey,
  myOneTimeAgentDid,
  myOneTimeAgentVerKey,
  myOneTimeDid,
  myOneTimeVerKey,
  myAgencyVerKey,
  myPairwisePeerVerKey,
}: {
  url: string,
  messageType: string,
  messageReplyId: string,
  message: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  myPairwiseAgentDid: string,
  myPairwiseAgentVerKey: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerKey: string,
  myOneTimeDid: string,
  myOneTimeVerKey: string,
  myAgencyVerKey: string,
  myPairwisePeerVerKey: string,
}) {
  return await RNIndy.sendMessage(
    url,
    messageType,
    messageReplyId,
    message,
    myPairwiseDid,
    myPairwiseVerKey,
    myPairwiseAgentDid,
    myPairwiseAgentVerKey,
    myOneTimeAgentDid,
    myOneTimeAgentVerKey,
    myOneTimeDid,
    myOneTimeVerKey,
    myAgencyVerKey,
    myPairwisePeerVerKey
  )
}

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
import {
  convertAgencyConfigToVcxProvision,
  convertVcxProvisionResultToUserOneTimeInfo,
  convertCxsInitToVcxInit,
  convertCxsPushConfigToVcxPushTokenConfig,
  convertInvitationToVcxConnectionCreate,
  convertVcxConnectionToCxsConnection,
} from './vcx-transformers'
import type {
  VcxProvisionResult,
  VcxProvision,
  CxsInitConfig,
  CxsPushTokenConfig,
  VcxConnectionConnectResult,
} from './type-cxs'
import type { UserOneTimeInfo } from '../../store/user/type-user-store'
import type { AgencyPoolConfig } from '../../store/type-config-store'
import type { MyPairwiseInfo } from '../../store/type-connection-store'
import type { WalletHistoryEvent } from '../../wallet/type-wallet'

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
      poolConfig
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
    throw e
  }

  // TODO: What if Indy throws error and we don't get any DID
  return {
    identifier,
    verificationKey,
  }
}

export async function generateClaimRequest(
  remoteDid: string,
  claimOffer: IndyClaimOffer,
  poolConfig: string
) {
  // be sure to call initVcx before calling this method
  const indyClaimOffer = {
    issuer_did: claimOffer.issuerDid,
    schema_seq_no: claimOffer.schemaSequenceNumber,
  }

  const claimRequest: string = await RNIndy.generateClaimRequest(
    remoteDid,
    JSON.stringify(indyClaimOffer),
    poolConfig
  )

  return claimRequest
}

export async function addClaim(claim: string, poolConfig: string) {
  // be sure to call ensureInitVcx before calling this method
  return await RNIndy.addClaim(claim, poolConfig)
}

export async function getClaim(filterJSON: string, poolConfig: string) {
  // be sure to call ensureInitVcx before calling this method
  return await RNIndy.getClaim(filterJSON, poolConfig)
}

export async function prepareProof(proofRequest: string, poolConfig: string) {
  // be sure to call ensureInitVcx before calling this method
  const prepareProofJSON: string = await RNIndy.prepareProof(
    proofRequest,
    poolConfig
  )

  return prepareProofJSON
}

export async function generateProof(
  proofRequest: string,
  remoteDid: string,
  prepareProof: string,
  requestedClaims: string,
  poolConfig: string
) {
  // be sure to call ensureInitVcx before calling this method
  const proof: string = await RNIndy.getProof(
    proofRequest,
    remoteDid,
    prepareProof,
    requestedClaims,
    poolConfig
  )

  return proof
}

export async function connectToAgency({
  url,
  myDid,
  agencyDid,
  myVerKey,
  agencyVerKey,
  poolConfig,
}: {
  url: string,
  myDid: string,
  agencyDid: string,
  myVerKey: string,
  agencyVerKey: string,
  poolConfig: string,
}) {
  const connectResponse: ConnectAgencyResponse = await RNIndy.connectToAgency(
    url,
    myDid,
    agencyDid,
    myVerKey,
    agencyVerKey,
    poolConfig
  )

  return connectResponse
}

export async function registerWithAgency({
  url,
  oneTimeAgencyVerKey,
  oneTimeAgencyDid,
  myOneTimeVerKey,
  agencyVerKey,
  poolConfig,
}: {
  url: string,
  oneTimeAgencyVerKey: string,
  oneTimeAgencyDid: string,
  myOneTimeVerKey: string,
  agencyVerKey: string,
  poolConfig: string,
}) {
  const registerResponse: RegisterAgencyResponse = await RNIndy.signupWithAgency(
    url,
    oneTimeAgencyVerKey,
    oneTimeAgencyDid,
    myOneTimeVerKey,
    agencyVerKey,
    poolConfig
  )

  return registerResponse
}

export async function createOneTimeAgent({
  url,
  oneTimeAgencyVerKey,
  oneTimeAgencyDid,
  myOneTimeVerKey,
  agencyVerKey,
  poolConfig,
}: {
  url: string,
  oneTimeAgencyVerKey: string,
  oneTimeAgencyDid: string,
  myOneTimeVerKey: string,
  agencyVerKey: string,
  poolConfig: string,
}) {
  const createOneTimeAgentResponse: CreateOneTimeAgentResponse = await RNIndy.createOneTimeAgent(
    url,
    oneTimeAgencyVerKey,
    oneTimeAgencyDid,
    myOneTimeVerKey,
    agencyVerKey,
    poolConfig
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
  poolConfig,
}: {
  url: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  oneTimeAgentVerKey: string,
  oneTimeAgentDid: string,
  myOneTimeVerKey: string,
  agencyVerKey: string,
  poolConfig: string,
}) {
  const createPairwiseAgentResponse: CreatePairwiseAgentResponse = await RNIndy.createPairwiseAgent(
    url,
    myPairwiseDid,
    myPairwiseVerKey,
    oneTimeAgentVerKey,
    oneTimeAgentDid,
    myOneTimeVerKey,
    agencyVerKey,
    poolConfig
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
  poolConfig,
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
  poolConfig: string,
}) {
  // be sure to call ensureInitVcx before calling this method
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
    myAgencyVerKey,
    poolConfig
  )

  return acceptInvitationResponse
}

export async function acceptInvitationVcx(
  connectionHandle: number
): Promise<MyPairwiseInfo> {
  // above API will be removed and this api shall be renamed to acceptInvitation
  // we will do this once we have integration with vcx
  const result: VcxConnectionConnectResult = await RNIndy.acceptInvitation(
    connectionHandle
  )

  return convertVcxConnectionToCxsConnection(result)
}

export async function updatePushToken({
  url,
  token,
  uniqueDeviceId,
  myOneTimeAgentDid,
  myOneTimeAgentVerKey,
  myOneTimeVerKey,
  myAgencyVerKey,
  poolConfig,
}: {
  url: string,
  token: string,
  uniqueDeviceId: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerKey: string,
  myOneTimeVerKey: string,
  myAgencyVerKey: string,
  poolConfig: string,
}) {
  // be sure to call ensureInitVcx before calling this method
  return await RNIndy.updatePushToken(
    url,
    token,
    uniqueDeviceId,
    myOneTimeAgentDid,
    myOneTimeAgentVerKey,
    myOneTimeVerKey,
    myAgencyVerKey,
    poolConfig
  )
}

export async function updatePushTokenVcx(pushTokenConfig: CxsPushTokenConfig) {
  return await RNIndy.updatePushToken(
    JSON.stringify(convertCxsPushConfigToVcxPushTokenConfig(pushTokenConfig))
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
  poolConfig,
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
  poolConfig: string,
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
    myAgencyVerKey,
    poolConfig
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
  poolConfig,
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
  poolConfig: string,
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
    myPairwisePeerVerKey,
    poolConfig
  )
}

export async function deleteConnection({
  url,
  myPairwiseDid,
  myPairwiseVerKey,
  myPairwiseAgentDid,
  myPairwiseAgentVerKey,
  myOneTimeAgentDid,
  myOneTimeAgentVerKey,
  myOneTimeDid,
  myOneTimeVerKey,
  myAgencyVerKey,
  poolConfig,
}: {
  url: string,
  myPairwiseDid: string,
  myPairwiseVerKey: string,
  myPairwiseAgentDid: string,
  myPairwiseAgentVerKey: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerKey: string,
  myOneTimeDid: string,
  myOneTimeVerKey: string,
  myAgencyVerKey: string,
  poolConfig: string,
}) {
  // be sure to call ensureInitVcx before calling this method
  return await RNIndy.deleteConnection(
    url,
    myPairwiseDid,
    myPairwiseVerKey,
    myPairwiseAgentDid,
    myPairwiseAgentVerKey,
    myOneTimeAgentDid,
    myOneTimeAgentVerKey,
    myOneTimeDid,
    myOneTimeVerKey,
    myAgencyVerKey,
    poolConfig
  )
}

// TODO remove this API when vcx is available
// instead of this we should use shutdown
export async function reset(poolConfig: string) {
  // be sure to call ensureInitVcx before calling this method
  return await RNIndy.switchEnvironment(poolConfig)
}

export async function resetVcx(removeData: boolean): Promise<boolean> {
  // we would remove above reset method and rename this method to reset
  // once we have integration available with vcx
  const result: boolean = await RNIndy.reset(true)

  return result
}

export async function getColor(imagePath: string): Promise<Array<string>> {
  return RNIndy.getColor(imagePath)
}

export async function createOneTimeInfo(
  agencyConfig: AgencyPoolConfig
): Promise<UserOneTimeInfo> {
  const provisionResult: VcxProvisionResult = await RNIndy.createOneTimeInfo(
    JSON.stringify(convertAgencyConfigToVcxProvision(agencyConfig))
  )

  return convertVcxProvisionResultToUserOneTimeInfo(provisionResult)
}

export async function init(config: CxsInitConfig): Promise<boolean> {
  const initResult: boolean = await RNIndy.init(
    JSON.stringify(convertCxsInitToVcxInit(config))
  )

  return initResult
}

export async function createConnectionWithInvite(
  invitation: InvitationPayload
): Promise<number> {
  const connectionHandle: number = await RNIndy.createConnectionWithInvite(
    invitation.requestId,
    JSON.stringify(convertInvitationToVcxConnectionCreate(invitation))
  )

  return connectionHandle
}

export async function downloadClaimOffer() {
  // TODO:KS Complete signature as per vcx
  // Add these methods in Java & objective-c wrapper
}

export async function downloadClaim() {
  // TODO:KS Complete signature as per vcx
  // Add this methods in Java & objective-c wrapper
}

export async function downloadProofRequest() {
  // TODO:KS Complete signature as per vcx
  // Add this methods in Java & objective-c wrapper
}

export async function getWalletBalance(): Promise<number> {
  return new Promise.resolve(10000)
}

export async function getWalletAddresses(): Promise<Array<string>> {
  const walletAddressesData = [
    'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
  ]
  return new Promise.resolve(walletAddressesData)
}

export async function getWalletHistory(): Promise<WalletHistoryEvent[]> {
  const walletHistoryData = [
    {
      id: 'asd',
      senderAddress:
        'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
      action: 'Withdraw',
      tokenAmount: 5656,
      timeStamp: 'Tue, 04 Aug 2015 12:38:41 GMT',
    },
    {
      id: 'kld',
      senderName: 'Sovrin Foundation',
      senderAddress:
        'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
      action: 'Purchase',
      tokenAmount: 10000,
      timeStamp: 'Tue, 04 Aug 2015 14:38:41 GMT',
    },
  ]
  return new Promise.resolve(walletHistoryData)
}

export async function getZippedWalletBackupPath({
  documentDirectory,
  agencyConfig,
}: {
  documentDirectory: string,
  agencyConfig: AgencyPoolConfig,
}): Promise<string> {
  const backup = await RNIndy.backupWallet(
    documentDirectory,
    JSON.stringify(agencyConfig)
  )

  return backup // exposes the zip file path to the user
}

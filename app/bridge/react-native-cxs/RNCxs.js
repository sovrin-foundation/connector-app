// @flow
import { NativeModules } from 'react-native'
import memoize from 'lodash.memoize'
import type {
  Metadata,
  IndyClaimOffer,
  ConnectAgencyResponse,
  RegisterAgencyResponse,
  CreateOneTimeAgentResponse,
  CreatePairwiseAgentResponse,
  AcceptInvitationResponse,
  CxsCredentialOfferResult,
  InitWithGenesisPathConfig,
  VcxProvisionResult,
  VcxProvision,
  CxsInitConfig,
  VcxInitConfig,
  CxsPushTokenConfig,
  VcxCredentialOfferResult,
  VcxCredentialOffer,
  VcxClaimInfo,
  VcxConnectionConnectResult,
  VcxProofRequest,
} from './type-cxs'
import type { InvitationPayload } from '../../invitation/type-invitation'
import {
  convertAgencyConfigToVcxProvision,
  convertVcxProvisionResultToUserOneTimeInfo,
  convertCxsInitToVcxInit,
  convertCxsPushConfigToVcxPushTokenConfig,
  convertInvitationToVcxConnectionCreate,
  convertVcxConnectionToCxsConnection,
  convertVcxCredentialOfferToCxsClaimOffer,
} from './vcx-transformers'
import type { UserOneTimeInfo } from '../../store/user/type-user-store'
import type { AgencyPoolConfig } from '../../store/type-config-store'
import type { MyPairwiseInfo } from '../../store/type-connection-store'
import type {
  ClaimOfferPushPayload,
  ClaimPushPayload,
} from '../../push-notification/type-push-notification'
import type {
  WalletHistoryEvent,
  WalletPayload,
} from '../../wallet/type-wallet'
import type { GenericStringObject } from '../../common/type-common'
import type { Passphrase } from '../../backup/type-backup'
import type { GetClaimVcxResult } from '../../claim/type-claim'

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
  // hard coding connection options to QR type for now, because vcx needs connection options
  // API for vcx assumes that it is running on enterprise side and not from consumer side
  // hence it tries to create connection with connection type.
  // However, our need is not to create a connection but to create a connection instance
  // with existing invitation. So, for now for any invitation type QR or SMS
  // we are hard coding connection option to QR
  const connectionOptions = { connection_type: 'QR', phone: '' }
  const result: string = await RNIndy.vcxAcceptInvitation(
    connectionHandle,
    JSON.stringify(connectionOptions)
  )
  // TODO:KS Remove below API call once sdk team returns pairwise info in above api
  // above call does not return pairwise did information, but we need pairwise info
  // to store that information and have those details available while making a connection
  // we have to make an extra call to get pairwise info
  const serializedConnection: string = await serializeConnection(
    connectionHandle
  )

  const vcxConnection: { data: VcxConnectionConnectResult } = JSON.parse(
    serializedConnection
  )

  return convertVcxConnectionToCxsConnection(vcxConnection.data)
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
  return await RNIndy.vcxUpdatePushToken(
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

export async function sendTokenAmount(
  tokenAmount: number,
  recipientWalletAddress: string,
  senderWalletAddress: string
): Promise<boolean> {
  return new Promise.resolve(true)
  // TODO:KS Complete signature as per vcx
  // Add these methods in Java & objective-c wrapper
}

export async function createOneTimeInfo(
  agencyConfig: AgencyPoolConfig
): Promise<UserOneTimeInfo> {
  const provisionVcxResult: string = await RNIndy.createOneTimeInfo(
    JSON.stringify(convertAgencyConfigToVcxProvision(agencyConfig))
  )
  const provisionResult: VcxProvisionResult = JSON.parse(provisionVcxResult)
  return convertVcxProvisionResultToUserOneTimeInfo(provisionResult)
}

export async function init(
  config: CxsInitConfig,
  fileName: string
): Promise<boolean> {
  const genesis_path: string = await RNIndy.getGenesisPathWithConfig(
    config.poolConfig,
    fileName
  )

  const initConfig = {
    ...config,
    genesis_path,
  }
  const initResult: boolean = await RNIndy.init(
    JSON.stringify(convertCxsInitToVcxInit(initConfig))
  )

  return initResult
}

export async function createConnectionWithInvite(
  invitation: InvitationPayload
): Promise<number> {
  const { invite_details } = convertInvitationToVcxConnectionCreate(invitation)
  const connectionHandle: number = await RNIndy.createConnectionWithInvite(
    invitation.requestId,
    JSON.stringify(invite_details)
  )

  return connectionHandle
}

export async function serializeConnection(
  connectionHandle: number
): Promise<string> {
  const serializedConnection: string = await RNIndy.getSerializedConnection(
    connectionHandle
  )

  return serializedConnection
}

// cache Promise of serializedString so that we don't call Bridge method again
export const getHandleBySerializedConnection = memoize(async function(
  serializedConnection: string
): Promise<number> {
  const connectionHandle: number = await RNIndy.deserializeConnection(
    serializedConnection
  )

  return connectionHandle
})

export async function downloadClaimOffer(
  connectionHandle: number,
  sourceId: string,
  messageId: string
): Promise<CxsCredentialOfferResult> {
  const {
    credential_offer,
    credential_handle,
  }: VcxCredentialOfferResult = await RNIndy.credentialCreateWithMsgId(
    sourceId,
    connectionHandle,
    messageId
  )
  const {
    credential_offer: vcxCredentialOffer,
  }: { credential_offer: VcxCredentialOffer } = JSON.parse(credential_offer)

  return {
    claimHandle: credential_handle,
    claimOffer: convertVcxCredentialOfferToCxsClaimOffer(vcxCredentialOffer),
  }
}

export async function serializeClaimOffer(
  claimHandle: number
): Promise<string> {
  const serializedClaimOffer: string = await RNIndy.serializeClaimOffer(
    claimHandle
  )

  return serializedClaimOffer
}

export const getClaimHandleBySerializedClaimOffer = memoize(async function(
  serializedClaimOffer: string
): Promise<number> {
  const claimHandle: number = await RNIndy.deserializeClaimOffer(
    serializedClaimOffer
  )

  return claimHandle
})

export async function sendClaimRequest(
  claimHandle: number,
  connectionHandle: number,
  paymentHandle: number
): Promise<void> {
  return await RNIndy.sendClaimRequest(
    claimHandle,
    connectionHandle,
    paymentHandle
  )
}

export async function downloadProofRequest(
  sourceId: string,
  connectionHandle: number,
  messageId: string
): Promise<VcxProofRequest> {
  const {
    proofHandle,
    proofRequest,
  }: {
    proofHandle: number,
    proofRequest: string,
  } = await RNIndy.proofCreateWithMsgId(sourceId, connectionHandle, messageId)

  const vcxProofRequest: VcxProofRequest = JSON.parse(proofRequest)

  return {
    ...vcxProofRequest,
    proofHandle,
  }
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
  recoveryPassphrase,
}: {
  documentDirectory: string,
  agencyConfig: AgencyPoolConfig,
  recoveryPassphrase: Passphrase,
}): Promise<string> {
  const backupPath = await RNIndy.backupWallet(
    documentDirectory,
    JSON.stringify(recoveryPassphrase),
    JSON.stringify(agencyConfig)
  )

  return backupPath
}

export function saveFileDocumentsDirectory(uri: string): Promise<boolean> {
  // TODO: Remove the below code (only for testing the UI flow)
  const count = Math.random()
  if (count < 0.7) {
    return new Promise.resolve(true)
  } else {
    return new Promise.reject(false)
  }
}

export function decryptWalletFile(passphrase: string): Promise<boolean> {
  // TODO: Remove the below code (only for testing the UI flow)
  const count = Math.random()
  if (count < 0.7) {
    return new Promise.resolve(true)
  } else {
    return new Promise.reject(false)
  }
}

export async function updateClaimOfferState(claimHandle: number) {
  const updatedState: number = await RNIndy.updateClaimOfferState(claimHandle)

  return updatedState
}

export async function getClaimOfferState(claimHandle: number): Promise<number> {
  const state: number = await RNIndy.getClaimOfferState(claimHandle)

  return state
}

export async function getClaimVcx(
  claimHandle: number
): Promise<GetClaimVcxResult> {
  const vcxClaimResult: string = await RNIndy.getClaimVcx(claimHandle)
  const vcxClaim: VcxClaimInfo = JSON.parse(vcxClaimResult)
  const { credential, credential_id } = vcxClaim

  if (!credential || !credential_id) {
    throw new Error('credential not found in vcx')
  }

  return {
    claimUuid: credential_id,
    claim: credential,
  }
}

export async function exportWallet(wallet: WalletPayload): Promise<number> {
  const exportHandle: number = await RNIndy.exportWallet(
    wallet.walletPath,
    wallet.encryptionKey
  )

  return exportHandle
}

export async function importWallet(wallet: WalletPayload): Promise<number> {
  const importHandle: number = await RNIndy.importWallet(
    wallet.walletPath,
    wallet.encryptionKey
  )

  return importHandle
}

export async function getMatchingCredentials(
  proofHandle: number
): Promise<string> {
  // TODO:KS Add a transformer here, for now we are just passing through
  return await RNIndy.proofRetrieveCredentials(proofHandle)
}

export async function generateProof(
  proofHandle: number,
  selectedCredentials: string,
  selfAttestedAttributes: string
): Promise<void> {
  return await RNIndy.proofGenerate(
    proofHandle,
    selectedCredentials,
    selfAttestedAttributes
  )
}

export async function sendProof(
  proofHandle: number,
  connectionHandle: number
): Promise<void> {
  return await RNIndy.proofSend(proofHandle, connectionHandle)
}

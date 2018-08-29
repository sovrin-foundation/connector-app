// @flow
import { NativeModules, Platform } from 'react-native'
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
  WalletTokenInfo,
  PaymentAddress,
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
  paymentHandle,
  getWalletKey,
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
import uniqueId from 'react-native-unique-id'

const { RNIndy } = NativeModules

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

export async function updatePushTokenVcx(pushTokenConfig: CxsPushTokenConfig) {
  return await RNIndy.vcxUpdatePushToken(
    JSON.stringify(convertCxsPushConfigToVcxPushTokenConfig(pushTokenConfig))
  )
}

export async function deleteConnection(connectionHandle: number) {
  return await RNIndy.deleteConnection(connectionHandle)
}

export async function resetVcx(removeData: boolean): Promise<boolean> {
  // we would remove above reset method and rename this method to reset
  // once we have integration available with vcx
  const result: boolean = await RNIndy.reset(true)

  return result
}

export async function vcxShutdown(deletePool: boolean): Promise<boolean> {
  const result: Number = await RNIndy.shutdownVcx(deletePool)

  return true
}

export async function getColor(imagePath: string): Promise<Array<string>> {
  return RNIndy.getColor(imagePath)
}

export async function sendTokenAmount(
  tokenAmount: string,
  recipientWalletAddress: string
): Promise<boolean> {
  return RNIndy.sendTokens(paymentHandle, tokenAmount, recipientWalletAddress)
}

export async function createOneTimeInfo(
  agencyConfig: AgencyPoolConfig
): Promise<UserOneTimeInfo> {
  const walletPoolName = await getWalletPoolName()
  const vcxProvisionConfig: VcxProvision = await convertAgencyConfigToVcxProvision(
    agencyConfig,
    walletPoolName
  )
  const provisionVcxResult: string = await RNIndy.createOneTimeInfo(
    JSON.stringify(vcxProvisionConfig)
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
  const walletPoolName = await getWalletPoolName()
  const vcxInitConfig: VcxInitConfig = await convertCxsInitToVcxInit(
    initConfig,
    walletPoolName
  )
  const initResult: boolean = await RNIndy.init(JSON.stringify(vcxInitConfig))

  return initResult
}

// TODO:KS Need to rename this to something like walletInit
export async function simpleInit(): Promise<boolean> {
  const walletPoolName = await getWalletPoolName()
  const wallet_key = await getWalletKey()
  const initConfig = {
    wallet_name: walletPoolName.walletName,
    wallet_key,
  }
  const initResult: boolean = await RNIndy.init(JSON.stringify(initConfig))
  return initResult
}

export const getWalletPoolName = memoize(async function() {
  const appUniqueId = await uniqueId()
  const walletName = `${appUniqueId}-cm-wallet`
  // Not sure why, but VCX is applying validation check on pool name
  // they don't like alphanumeric or _, so we have to remove "-"
  // from our guid that we generated
  const strippedAppUniqueId = appUniqueId.replace(/\-/g, '')
  const poolName = `${strippedAppUniqueId}cmpool`

  return {
    walletName,
    poolName,
  }
})

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
    price,
  }: { credential_offer: VcxCredentialOffer, price: number } = JSON.parse(
    credential_offer
  )

  vcxCredentialOffer.price = price ? price.toString() : null

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

export async function getWalletBalance(): Promise<string> {
  const { balance_str: balance }: WalletTokenInfo = await getWalletTokenInfo()

  return balance
}

export async function getWalletAddresses(): Promise<string[]> {
  const { addresses }: WalletTokenInfo = await getWalletTokenInfo()

  // TODO:KS For now we don't need to store any other data on our react-native
  // when we need to store all data, then we would return only addresses
  // for now we are just returning addresses and ignoring anything else
  return addresses.map((address: PaymentAddress) => address.address)
}

export async function getWalletHistory(): Promise<WalletHistoryEvent[]> {
  const walletHistoryData = [
    {
      id: 'asd',
      senderAddress:
        'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
      action: 'Withdraw',
      tokenAmount: '5656',
      timeStamp: 'Tue, 04 Aug 2015 12:38:41 GMT',
    },
    {
      id: 'kld',
      senderName: 'Sovrin Foundation',
      senderAddress:
        'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
      action: 'Purchase',
      tokenAmount: '10000',
      timeStamp: 'Tue, 04 Aug 2015 14:38:41 GMT',
    },
  ]

  return new Promise.resolve(walletHistoryData)
}

export async function encryptWallet({
  encryptedFileLocation,
  recoveryPassphrase,
}: {
  encryptedFileLocation: string,
  recoveryPassphrase: Passphrase,
}): Promise<number> {
  const exportHandle: number = await RNIndy.exportWallet(
    encryptedFileLocation,
    recoveryPassphrase.hash
  )

  return exportHandle
}

export async function decryptWalletFile(
  walletPath: string,
  decryptionKey: string
): Promise<number> {
  const { walletName } = await getWalletPoolName()
  const wallet_key = await getWalletKey()

  const config = JSON.stringify({
    wallet_name: walletName,
    wallet_key,
    exported_wallet_path: walletPath,
    backup_key: decryptionKey,
  })
  const importHandle: number = await RNIndy.decryptWalletFile(config)

  return importHandle
}

export async function copyToPath(
  uri: string,
  destPath: string
): Promise<number> {
  return await RNIndy.copyToPath(uri, destPath)
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

export async function setWalletItem(
  key: string,
  value: string
): Promise<number> {
  return await RNIndy.setWalletItem(key, value)
}

export async function getWalletItem(key: string): Promise<string> {
  const response: string = await RNIndy.getWalletItem(key)
  if (response) {
    const itemValue = JSON.parse(response)
    const { value } = itemValue

    if (!value) {
      throw new Error('cannot get value')
    }

    return value
  } else {
    return response
  }
}

export async function deleteWalletItem(key: string): Promise<number> {
  return await RNIndy.deleteWalletItem(key)
}

export async function updateWalletItem(
  key: string,
  data: string
): Promise<number> {
  return await RNIndy.updateWalletItem(key, data)
}

export function exitAppAndroid() {
  if (Platform.OS === 'android') {
    RNIndy.exitAppAndroid()
  }
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

export async function proofCreateWithRequest(
  sourceId: string,
  proofRequest: string
): Promise<number> {
  return await RNIndy.proofCreateWithRequest(sourceId, proofRequest)
}

export async function proofSerialize(proofHandle: number): Promise<string> {
  return await RNIndy.proofSerialize(proofHandle)
}

export async function proofDeserialize(
  serializedProofRequest: string
): Promise<number> {
  return await RNIndy.proofDeserialize(serializedProofRequest)
}

export async function downloadMessages(
  messageStatus: string,
  uid_s: ?string,
  pwdids: string
): Promise<string> {
  return await RNIndy.downloadMessages(messageStatus, uid_s, pwdids)
}
export async function updateMessages(
  messageStatus: string,
  pwdidsJson: string
): Promise<number> {
  return await RNIndy.updateMessages(messageStatus, pwdidsJson)
}

export async function getWalletTokenInfo(): Promise<WalletTokenInfo> {
  const paymentHandle = 0
  const tokenInfo: string = await RNIndy.getTokenInfo(paymentHandle)
  return JSON.parse(tokenInfo)
}

export async function createPaymentAddress(seed: ?string) {
  return RNIndy.createPaymentAddress(seed)
}

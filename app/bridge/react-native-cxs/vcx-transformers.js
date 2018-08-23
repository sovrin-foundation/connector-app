// @flow
import { NativeModules, Platform } from 'react-native'
import memoize from 'lodash.memoize'
import type { AgencyPoolConfig } from '../../store/type-config-store'
import type {
  VcxProvision,
  VcxProvisionResult,
  CxsInitConfig,
  InitWithGenesisPathConfig,
  VcxInitConfig,
  CxsPushTokenConfig,
  VcxPushTokenConfig,
  VcxCreateConnection,
  VcxConnectionConnectResult,
  VcxCredentialOffer,
  WalletPoolName,
} from './type-cxs'
import type { UserOneTimeInfo } from '../../store/user/type-user-store'
import type { InvitationPayload } from '../../invitation/type-invitation'
import type { MyPairwiseInfo } from '../../store/type-connection-store'
import type { ClaimOfferPushPayload } from '../../push-notification/type-push-notification'
import { setItem, getItem, deleteItem } from '../../services/secure-storage'

const { RNIndy } = NativeModules

export const paymentHandle = 0

export const WALLET_KEY = 'WALLET_KEY'
export const getWalletKey = memoize(async function(): Promise<string> {
  try {
    let walletKey: string | null = await getItem(WALLET_KEY)
    if (walletKey) {
      return walletKey
    }

    const lengthOfKey = 64
    walletKey = await RNIndy.createWalletKey(lengthOfKey)
    if (Platform.OS === 'android') {
      walletKey = walletKey.slice(0, -1)
    }

    await setItem(WALLET_KEY, walletKey)

    return walletKey
  } catch (e) {
    // not sure what to do if keychain/keystore fails
    throw e
  }
})

export async function convertAgencyConfigToVcxProvision(
  config: AgencyPoolConfig,
  walletPoolName: WalletPoolName
): Promise<VcxProvision> {
  const wallet_key = await getWalletKey()
  return {
    agency_url: config.agencyUrl,
    agency_did: config.agencyDID,
    agency_verkey: config.agencyVerificationKey,
    wallet_name: walletPoolName.walletName,
    wallet_key,
    agent_seed: null,
    enterprise_seed: null,
  }
}

export function convertVcxProvisionResultToUserOneTimeInfo(
  provision: VcxProvisionResult
): UserOneTimeInfo {
  return {
    oneTimeAgencyDid: provision.institution_did,
    oneTimeAgencyVerificationKey: provision.institution_verkey,
    myOneTimeDid: provision.sdk_to_remote_did,
    myOneTimeVerificationKey: provision.sdk_to_remote_verkey,
    myOneTimeAgentDid: provision.remote_to_sdk_did,
    myOneTimeAgentVerificationKey: provision.remote_to_sdk_verkey,
  }
}

export async function convertCxsInitToVcxInit(
  init: InitWithGenesisPathConfig,
  walletPoolName: WalletPoolName
): Promise<VcxInitConfig> {
  const wallet_key = await getWalletKey()
  return {
    agency_endpoint: init.agencyUrl,
    agency_did: init.agencyDID,
    agency_verkey: init.agencyVerificationKey,
    config: init.poolConfig,
    pool_name: walletPoolName.poolName,
    wallet_name: walletPoolName.walletName,
    wallet_key,
    genesis_path: init.genesis_path,
    remote_to_sdk_did: init.myOneTimeAgentDid,
    remote_to_sdk_verkey: init.myOneTimeAgentVerificationKey,
    sdk_to_remote_did: init.myOneTimeDid,
    sdk_to_remote_verkey: init.myOneTimeVerificationKey,
    // TODO: These should be removed after we sdk team fix these as optional
    institution_name: 'some-random-name',
    institution_logo_url: 'https://robothash.com/logo.png',
    institution_did: init.oneTimeAgencyDid,
    institution_verkey: init.oneTimeAgencyVerificationKey,
  }
}

export function convertCxsPushConfigToVcxPushTokenConfig(
  pushConfig: CxsPushTokenConfig
): VcxPushTokenConfig {
  return {
    id: pushConfig.uniqueId,
    value: pushConfig.pushToken,
  }
}

export function convertInvitationToVcxConnectionCreate(
  invitation: InvitationPayload
): VcxCreateConnection {
  return {
    source_id: invitation.requestId,
    invite_details: {
      connReqId: invitation.requestId,
      // TODO: Add status code to be available in invitation payload
      // for now, it would always be MS-102
      statusCode: 'MS-102',
      senderDetail: invitation.senderDetail,
      senderAgencyDetail: invitation.senderAgencyDetail,
      targetName: invitation.senderName,
      // hard coding this for now, because this field does not matter anywhere for processing
      // and it will always be message sent for the purpose of connection create
      statusMsg: 'message sent',
    },
  }
}

export function convertVcxConnectionToCxsConnection(
  vcxConnection: VcxConnectionConnectResult
): MyPairwiseInfo {
  return {
    myPairwiseDid: vcxConnection.pw_did,
    myPairwiseVerKey: vcxConnection.pw_verkey,
    myPairwiseAgentDid: vcxConnection.agent_did,
    myPairwiseAgentVerKey: vcxConnection.agent_vk,
    myPairwisePeerVerKey: vcxConnection.their_pw_verkey,
    senderDID: vcxConnection.their_pw_did,
  }
}

export function convertVcxCredentialOfferToCxsClaimOffer(
  vcxCredentialOffer: VcxCredentialOffer
): ClaimOfferPushPayload {
  return {
    msg_type: vcxCredentialOffer.msg_type,
    version: vcxCredentialOffer.version,
    to_did: vcxCredentialOffer.to_did,
    from_did: vcxCredentialOffer.from_did,
    claim: vcxCredentialOffer.credential_attrs,
    claim_name: vcxCredentialOffer.claim_name,
    schema_seq_no: vcxCredentialOffer.schema_seq_no,
    issuer_did: vcxCredentialOffer.from_did,
    // should override it when generating claim offer object
    remoteName: '',
    price: vcxCredentialOffer.price,
  }
}

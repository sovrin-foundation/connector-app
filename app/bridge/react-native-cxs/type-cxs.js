// @flow

import type { SMSPendingInvitationPayload } from '../../sms-pending-invitation/type-sms-pending-invitation'
import type { UserOneTimeInfo } from '../../store/user/type-user-store'
import type { AgencyPoolConfig } from '../../store/type-config-store'
import type { GenericObject } from '../../common/type-common'
import type {
  ClaimOfferPushPayload,
  ClaimPushPayload,
} from '../../push-notification/type-push-notification'
import type { ProofRequestPushPayload } from '../../proof-request/type-proof-request'

export type Metadata = {
  [string]: any,
}

export type IndyClaimOffer = {
  issuerDid: string,
  schemaSequenceNumber: number,
}

export type IndyConnectionHistory = {
  issuerDid: string,
  schemaSequenceNumber: number,
}

export type IndyClaimRequest = {
  blinded_ms: {
    prover_did: string,
    u: string,
    ur?: string,
  },
  issuer_did: string,
  schema_seq_no: number,
}

export type ConnectAgencyResponse = {
  '@type': {
    name: string,
    ver: string,
  },
  withPairwiseDID: string,
  withPairwiseDIDVerKey: string,
}

export type RegisterAgencyResponse = {
  '@type': { name: string, ver: string },
}

export type CreateOneTimeAgentResponse = {
  '@type': { name: string, ver: string },
  withPairwiseDID: string,
  withPairwiseDIDVerKey: string,
}

export type CreatePairwiseAgentResponse = {
  '@type': { name: string, ver: string },
  withPairwiseDID: string,
  withPairwiseDIDVerKey: string,
}

export type AcceptInvitationResponse = {
  '@type': { name: string, ver: string },
  uid: string,
}

// TODO: Remove types that will not be used once vcx is integrated
export type VcxProvision = {
  agency_url: string,
  agency_did: string,
  agency_verkey: string,
}

export type VcxProvisionResult = {
  wallet_name: string,
  wallet_key: string,
  agency_endpoint: string,
  agency_did: string,
  agency_verkey: string,
  // myOneTimeDid
  sdk_to_remote_did: string,
  // myOneTimeVerificationKey
  sdk_to_remote_verkey: string,
  // oneTimeAgencyDid
  institution_did: string,
  // oneTimeAgencyVerificationKey
  institution_verkey: string,
  // myOneTimeAgentDid
  remote_to_sdk_did: string,
  // myOneTimeAgentVerificationKey
  remote_to_sdk_verkey: string,
}

export type CxsInitConfig = UserOneTimeInfo & AgencyPoolConfig

export type InitWithGenesisPathConfig = CxsInitConfig & { genesis_path: string }

export type VcxInitConfig = {
  agency_endpoint: string,
  agency_did: string,
  agency_verkey: string,
  genesis_path: string,
  wallet_key: string,
  config: string,
  pool_name: string,
  wallet_name: string,
  remote_to_sdk_did: string,
  remote_to_sdk_verkey: string,
  sdk_to_remote_did: string,
  sdk_to_remote_verkey: string,
  institution_did: string,
  institution_verkey: string,
}

export type VcxPushTokenConfig = {
  id: string,
  value: string,
}

export type CxsPushTokenConfig = {
  uniqueId: string,
  pushToken: string,
}

export type VcxCreateConnection = {
  source_id: string,
  invite_details: SMSPendingInvitationPayload,
}

export type VcxConnectionCreateResult = number

export type VcxConnectionConnectResult = {
  source_id: string,
  pw_did: string,
  pw_verkey: string,
  uuid: string,
  endpoint: string,
  agent_did: string,
  agent_vk: string,
  their_pw_did: string,
  their_pw_verkey: string,
}

export type VcxCredentialOfferResult = {
  credential_handle: number,
  credential_offer: string,
}

export type VcxCredentialOffer = {
  msg_type: string,
  version: string,
  to_did: string,
  from_did: string,
  libindy_offer: string,
  cred_def_id: string,
  credential_attrs: { [string]: Array<string> },
  schema_seq_no: number,
  claim_name: string,
  claim_id: string,
  payment_address?: ?string,
  price?: ?string,
}

export type CxsCredentialOfferResult = {
  claimHandle: number,
  claimOffer: ClaimOfferPushPayload,
}

export type VcxSendCredentialRequest = {}

export type VcxClaimInfo = {
  credential_id?: string,
  credential?: ClaimPushPayload,
  credential_offer?: string,
}

export type VcxProofRequest = ProofRequestPushPayload

export type WalletPoolName = {
  walletName: string,
  poolName: string,
}

export type UTXO = {
  amount: number,
  extra: string,
  paymentAddress: string,
  source: string,
}

export type PaymentAddress = {
  address: string,
  balance: number,
  utxo: UTXO[],
}

export type WalletTokenInfo = {
  balance_str: string,
  addresses: PaymentAddress[],
}

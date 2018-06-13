// @flow
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
} from './type-cxs'
import type { UserOneTimeInfo } from '../../store/user/type-user-store'
import type { InvitationPayload } from '../../invitation/type-invitation'
import type { MyPairwiseInfo } from '../../store/type-connection-store'
import type { ClaimOfferPushPayload } from '../../push-notification/type-push-notification'

export function convertAgencyConfigToVcxProvision(
  config: AgencyPoolConfig
): VcxProvision {
  return {
    agency_url: config.agencyUrl,
    agency_did: config.agencyDID,
    agency_verkey: config.agencyVerificationKey,
    wallet_name: 'walletName',
    // TODO: wallet key needs to be handled on libvcx wrapper or on bridge for both ios and android not  tobe passed from js layer.
    wallet_key: 'walletKey',
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

export function convertCxsInitToVcxInit(
  init: InitWithGenesisPathConfig
): VcxInitConfig {
  return {
    agency_endpoint: init.agencyUrl,
    agency_did: init.agencyDID,
    agency_verkey: init.agencyVerificationKey,
    config: init.poolConfig,
    // TODO: Move these to constants,for now they will always be needed only here
    // but we still have to move these to constants
    pool_name: 'poolName',
    wallet_name: 'walletName',
    // TODO: wallet key needs to be handled on libvcx wrapper or on bridge for both ios and android not  tobe passed from js layer.
    wallet_key: 'walletKey',
    genesis_path: init.genesis_path,
    remote_to_sdk_did: init.myOneTimeAgentDid,
    remote_to_sdk_verkey: init.myOneTimeAgentVerificationKey,
    sdk_to_remote_did: init.myOneTimeDid,
    sdk_to_remote_verkey: init.myOneTimeVerificationKey,
    // TODO: These should be removed after we sdk team fix these as optional
    institution_name: 'some-random-name',
    institution_logo_url: 'https://robothash.com/logo.png',
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
    },
  }
}

export function convertVcxConnectionToCxsConnection(
  vcxConnectionString: string
): MyPairwiseInfo {
  const vcxConnection: VcxConnectionConnectResult = JSON.parse(
    vcxConnectionString
  )
  return {
    myPairwiseDid: vcxConnection.sa.d,
    myPairwiseVerKey: vcxConnection.sa.v,
    myPairwiseAgentDid: vcxConnection.s.dp.d,
    myPairwiseAgentVerKey: vcxConnection.s.dp.k,
    myPairwisePeerVerKey: vcxConnection.s.v,
    senderDID: vcxConnection.s.d,
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
  }
}

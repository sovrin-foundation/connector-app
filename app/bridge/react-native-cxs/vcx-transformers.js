// @flow
import type { AgencyPoolConfig } from '../../store/type-config-store'
import type {
  VcxProvision,
  VcxProvisionResult,
  CxsInitConfig,
  VcxInitConfig,
  CxsPushTokenConfig,
  VcxPushTokenConfig,
  VcxCreateConnection,
  VcxConnectionConnectResult,
} from './type-cxs'
import type { UserOneTimeInfo } from '../../store/user/type-user-store'
import type { InvitationPayload } from '../../invitation/type-invitation'
import type { MyPairwiseInfo } from '../../store/type-connection-store'

export function convertAgencyConfigToVcxProvision(
  config: AgencyPoolConfig
): VcxProvision {
  return {
    agency_url: config.agencyUrl,
    agency_did: config.agencyDID,
    agency_verkey: config.agencyVerificationKey,
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

export function convertCxsInitToVcxInit(init: CxsInitConfig): VcxInitConfig {
  return {
    agency_endpoint: init.agencyUrl,
    agency_did: init.agencyDID,
    agency_verkey: init.agencyVerificationKey,
    config: init.poolConfig,
    // TODO: Move these to constants,for now they will always be needed only here
    // but we still have to move these to constants
    pool_name: 'poolName',
    wallet_name: 'walletName',
    remote_to_sdk_did: init.myOneTimeAgentDid,
    sdk_to_remote_did: init.myOneTimeDid,
    remote_to_sdk_verkey: init.myOneTimeAgentVerificationKey,
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

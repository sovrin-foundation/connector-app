// @flow
import type { GenericObject } from '../common/type-common'
import { MESSAGE_TYPE } from './api-constants'
import type { IndyClaimRequest } from '../bridge/react-native-cxs/type-cxs'
import type { ProofApiData } from '../proof-request/type-proof-request'

export type ApiData = {
  method: string,
  mode: string,
  headers: { [string]: string },
  body?: string,
}

export type BackendError = {
  statusCode: string,
  statusMsg: string,
}

export type GetInvitationLinkApiData = {
  agencyUrl: string,
  smsToken: string,
}

export type MessageApiData = {
  agencyUrl: string,
  dataBody: GenericObject,
}

export type DownloadInvitationApiData = {
  url: string,
}

export type SendAuthenticationResponseApiData = {
  data: {
    identifier: string,
    dataBody: GenericObject,
  },
  config: {
    agencyUrl: string,
  },
}

export type SendMessageApiData = {
  agencyUrl: string,
  userPairwiseDid: string,
  agentPayload: GenericObject,
}

export type ApiClaimRequest = {
  userPairwiseDid: string,
  remoteDid: string,
} & IndyClaimRequest

export type SendClaimRequestApiData = {
  agencyUrl: string,
  userPairwiseDid: string,
  responseMsgId: string,
  claimRequest: ApiClaimRequest,
}
export type SendProofApiData = {
  agencyUrl: string,
  userPairwiseDid: string,
  responseMsgId: string,
  proof: ProofApiData,
}

export type EdgeClaimRequest = {
  msg_type: typeof MESSAGE_TYPE.CLAIM_REQUEST,
  version: string,
  to_did: string,
  from_did: string,
  tid: string,
  mid: string,
} & IndyClaimRequest

export type EnvironmentDetailUrlDownloaded = {
  agencyDID: string,
  agencyUrl: string,
  agencyVerificationKey: string,
  poolConfig: string,
}

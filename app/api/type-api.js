// @flow
import type { GenericObject } from '../common/type-common'

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

export type GetProfileApiData = {
  identifier: string,
  challenge: string,
  signature: string,
  agencyUrl: string,
}

export type SendMessageApiData = {
  agencyUrl: string,
  userPairwiseDid: string,
  agentPayload: GenericObject,
}

export type SendClaimRequestApiData = {
  agencyUrl: string,
  userPairwiseDid: string,
  responseMsgId: string,
  // TODO: Change this to an object and it should be stringified inside API
  claimRequest: string,
}

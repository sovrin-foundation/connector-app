// @flow
import { api, options } from './api-utils'
import type {
  GetInvitationLinkApiData,
  MessageApiData,
  DownloadInvitationApiData,
  SendAuthenticationResponseApiData,
  EnvironmentDetailUrlDownloaded,
} from './type-api'
import { PAYLOAD_TYPE, MESSAGE_TYPE, STATUS_CODE } from './api-constants'

export const getInvitationLink = ({
  agencyUrl,
  smsToken,
}: GetInvitationLinkApiData) =>
  api(`${agencyUrl}/agency/url-mapper/${smsToken}`, options('GET'))

export const invitationDetailsRequest = ({ url }: DownloadInvitationApiData) =>
  api(url, options('GET'))

export const getAdditionalData = ({ agencyUrl, dataBody }: MessageApiData) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const sendAuthenticationRequest = ({
  data: { identifier, dataBody },
  config: { agencyUrl },
}: SendAuthenticationResponseApiData) =>
  api(`${agencyUrl}/agent/${identifier}/auth`, options('PUT', dataBody), true)

export const downloadEnvironmentDetails = (
  url: string
): Promise<EnvironmentDetailUrlDownloaded> => api(url, options())

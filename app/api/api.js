// @flow
import { api, options } from './api-utils'
import type {
  GetInvitationLinkApiData,
  MessageApiData,
  DownloadInvitationApiData,
  SendAuthenticationResponseApiData,
  GetProfileApiData,
  SendMessageApiData,
  SendClaimRequestApiData,
} from './type-api'
import { PAYLOAD_TYPE, MESSAGE_TYPE, STATUS_CODE } from './api-constants'

export const getInvitationLink = ({
  agencyUrl,
  smsToken,
}: GetInvitationLinkApiData) =>
  api(`${agencyUrl}/agency/url-mapper/${smsToken}`, options('GET'))

export const invitationDetailsRequest = ({ url }: DownloadInvitationApiData) =>
  api(url, options('GET'))

export const connectWithConsumerAgency = ({
  agencyUrl,
  dataBody,
}: MessageApiData) => api(`${agencyUrl}/agency/msg`, options('POST', dataBody))

export const registerWithConsumerAgency = ({
  agencyUrl,
  dataBody,
}: MessageApiData) => api(`${agencyUrl}/agency/msg`, options('POST', dataBody))

export const createAgentWithConsumerAgency = ({
  agencyUrl,
  dataBody,
}: MessageApiData) => api(`${agencyUrl}/agency/msg`, options('POST', dataBody))

export const createAgentPairwiseKey = ({
  agencyUrl,
  dataBody,
}: MessageApiData) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const sendInvitationResponse = ({
  agencyUrl,
  dataBody,
}: MessageApiData) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const getAdditionalData = ({ agencyUrl, dataBody }: MessageApiData) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const sendAuthenticationRequest = ({
  data: { identifier, dataBody },
  config: { agencyUrl },
}: SendAuthenticationResponseApiData) =>
  api(`${agencyUrl}/agent/${identifier}/auth`, options('PUT', dataBody), true)

export const getProfile = ({
  identifier,
  challenge,
  signature,
  agencyUrl,
}: GetProfileApiData) =>
  api(
    `${agencyUrl}/agent/${identifier}/remote/profile?challenge=${challenge}&signature=${signature}`,
    options('GET')
  )

export const sendUpdatedPushToken = ({ agencyUrl, dataBody }: MessageApiData) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const sendMessage = ({
  agencyUrl,
  userPairwiseDid,
  agentPayload,
}: SendMessageApiData) =>
  api(
    `${agencyUrl}/agency/route`,
    options('POST', {
      to: userPairwiseDid,
      agentPayload: JSON.stringify(agentPayload),
    })
  )

export const sendClaimRequest = ({
  agencyUrl,
  userPairwiseDid,
  responseMsgId,
  claimRequest,
}: SendClaimRequestApiData) =>
  sendMessage({
    agencyUrl,
    userPairwiseDid,
    agentPayload: {
      type: PAYLOAD_TYPE.SEND_MESSAGE,
      msgType: MESSAGE_TYPE.CLAIM_REQUEST,
      edgeAgentPayload: claimRequest,
      refMsgId: responseMsgId,
      // just accept for now, we are not sending rejection as of now
      statusCode: STATUS_CODE.ACCEPT,
    },
  })

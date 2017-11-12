import { api, options } from './api-utils'

export const getInvitationLink = ({ agencyUrl, smsToken }) =>
  api(`${agencyUrl}/agency/url-mapper/${smsToken}`, options('GET'))

export const invitationDetailsRequest = ({ url }) => api(url, options('GET'))

export const connectWithConsumerAgency = ({ agencyUrl, dataBody }) =>
  api(`${agencyUrl}/agency/msg`, options('POST', dataBody))

export const registerWithConsumerAgency = ({ agencyUrl, dataBody }) =>
  api(`${agencyUrl}/agency/msg`, options('POST', dataBody))

export const createAgentWithConsumerAgency = ({ agencyUrl, dataBody }) =>
  api(`${agencyUrl}/agency/msg`, options('POST', dataBody))

export const sendInvitationResponse = ({ agencyUrl, dataBody }) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const getAdditionalData = ({ agencyUrl, dataBody }) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

export const sendAuthenticationRequest = ({
  data: { identifier, dataBody },
  config: { agencyUrl },
}) =>
  api(`${agencyUrl}/agent/${identifier}/auth`, options('PUT', dataBody), true)

export const getProfile = ({ identifier, challenge, signature, agencyUrl }) =>
  api(
    `${agencyUrl}/agent/${identifier}/remote/profile?challenge=${challenge}&signature=${signature}`
  )

export const sendQRInvitationResponse = ({ challenge, signature, agencyUrl }) =>
  api(
    `${agencyUrl}/agent/connection-req`,
    options('POST', { challenge, signature }),
    true
  )

export const sendUpdatedPushToken = ({ agencyUrl, dataBody }) =>
  api(`${agencyUrl}/agency/route`, options('POST', dataBody))

import { api, options } from './api-utils'

export const invitationDetailsRequest = ({ smsToken, agencyUrl }) =>
  api(`${agencyUrl}/agent/token/${smsToken}/connection-req`, options('GET'))

// Accept/Deny invitation from SMS received
export const sendSMSInvitationResponse = ({
  agencyUrl,
  challenge,
  signature,
  requestId,
  senderGeneratedUserDid,
}) =>
  api(
    `${agencyUrl}/agent/${senderGeneratedUserDid}/connection-req/${requestId}`,
    options('PUT', { challenge, signature }),
    true
  )

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

export const sendUpdatedPushToken = ({
  challenge,
  signature,
  agencyUrl,
  DID,
}) =>
  api(
    `${agencyUrl}/agent/${DID}/push-com-method`,
    options('PUT', { challenge, signature })
  )

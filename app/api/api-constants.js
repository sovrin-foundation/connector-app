// @flow

export const TOKEN_EXPIRED_CODE = 'MS-107'
export const SERVER_ERROR_CODE = 'OCS-000'
export const SERVER_API_CALL_ERROR = 'OCS-001'
export const PENDING_CONNECTION_REQUEST_CODE = 'CRS-103'
export const PUSH_NOTIFICATION_SENT_CODE = 'push-notification-sent'

export const QR_CODE_SENDER_DID = 'sD'
export const QR_CODE_SENDER_VERIFICATION_KEY = 'sVk'
export const QR_CODE_LOGO_URL = 'lu'
export const QR_CODE_REQUEST_ID = 'rid'
export const QR_CODE_AGENT_PROOF = 'sakdp'
export const QR_CODE_SENDER_NAME = 'sn'
export const QR_CODE_TARGET_NAME = 'tn'
export const QR_CODE_SENDER_ENDPOINT = 'e'

export const MESSAGE_TYPE = {
  AUTH: 'auth-req',
  CLAIM_OFFER: 'claimOffer',
  CLAIM_REQUEST: 'claimReq',
  PROOF_REQUEST: 'proofReq',
  CLAIM: 'claim',
}

export const API_TYPE = {
  CONNECT: 'CONNECT',
  REGISTER: 'REGISTER',
  CREATE_AGENT: 'CREATE_AGENT',
  INVITE_ANSWERED: 'INVITE_ANSWERED',
  CREATE_KEY: 'CREATE_KEY',
}

export const PAYLOAD_TYPE = {
  GET_MESSAGE: 'GET_MSGS',
  UPDATE_PUSH_COM_METHOD: 'UPDATE_PUSH_COM_METHOD',
  SEND_MESSAGE: 'SEND_MSG',
}

export const STATUS_CODE = {
  ACCEPT: 'MS-104',
}

export const ERROR_ALREADY_EXIST = {
  code: 'OCS',
  message: 'duplicate connection request',
}

export const ERROR_INVITATION_RESPONSE_PARSE_CODE = 'RN-100'

export const ERROR_INVITATION_RESPONSE_PARSE =
  'Error parsing error message in invitation response'

export const ERROR_PENDING_INVITATION_RESPONSE_PARSE_CODE = 'RN-101'

export const ERROR_PENDING_INVITATION_RESPONSE_PARSE =
  'Error parsing error message Pending Invitation SMS'

// @flow

export const TOKEN_EXPIRED_CODE = 'VES-101'
export const SERVER_ERROR_CODE = 'OCS-000'
export const SERVER_API_CALL_ERROR = 'OCS-001'
export const PENDING_CONNECTION_REQUEST_CODE = 'CRS-103'
export const PUSH_NOTIFICATION_SENT_CODE = 'push-notification-sent'

export const QR_CODE_REQUEST_ID = 'id'
export const QR_CODE_SENDER_DETAIL = 's'
export const QR_CODE_SENDER_DID = 'd'
export const QR_CODE_SENDER_NAME = 'n'
export const QR_CODE_LOGO_URL = 'l'
export const QR_CODE_SENDER_VERIFICATION_KEY = 'v'
export const QR_CODE_SENDER_KEY_DELEGATION = 'dp'
export const QR_CODE_DELEGATION_DID = 'd'
export const QR_CODE_DELEGATION_KEY = 'k'
export const QR_CODE_DELEGATION_SIGNATURE = 's'
export const QR_CODE_SENDER_AGENCY = 'sa'
export const QR_CODE_SENDER_AGENCY_DID = 'd'
export const QR_CODE_SENDER_AGENCY_KEY = 'v'
export const QR_CODE_SENDER_AGENCY_ENDPOINT = 'e'
export const QR_CODE_TARGET_NAME = 't'
export const GENESIS_FILE_NAME = 'pool_transactions_genesis'

export const MESSAGE_TYPE = {
  AUTH: 'auth-req',
  CLAIM_OFFER: 'credOffer',
  CLAIM_REQUEST: 'credReq',
  PROOF_REQUEST: 'proofReq',
  PROOF: 'proof',
  CLAIM: 'cred',
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

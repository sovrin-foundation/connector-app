// @flow
// export const TOKEN_EXPIRED_CODE = 'CRS-121'
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

// TODO: Delete these constants once QR Code is fixed as per new schema
export const QR_CODE_CHALLENGE = 'c'
export const QR_CODE_REMOTE_PAIR_WISE_DID = 'rpDID'
export const QR_CODE_REMOTE_HOSTING_DID = 'rhDID'

export const PUSH_NOTIFICATION_TYPE = {
  AUTH: 'auth-req',
  CLAIM_OFFER: 'claimOffer',
}

export const API_TYPE = {
  CONNECT: 'CONNECT',
  REGISTER: 'REGISTER',
  CREATE_AGENT: 'CREATE_AGENT',
  INVITE_ANSWERED: 'INVITE_ANSWERED',
}

export const PAYLOAD_TYPE = {
  GET_MESSAGE: 'GET_MSGS',
  UPDATE_PUSH_COM_METHOD: 'UPDATE_PUSH_COM_METHOD',
}

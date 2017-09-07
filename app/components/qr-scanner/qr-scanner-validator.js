import { schemaValidator } from '../../services/'
import {
  QR_CODE_SENDER_NAME,
  QR_CODE_UID,
  QR_CODE_REMOTE_HOSTING_DID,
  QR_CODE_REMOTE_PAIR_WISE_DID,
  QR_CODE_SIGNATURE,
  QR_CODE_TARGET_NAME,
  QR_CODE_CHALLENGE,
  QR_CODE_TARGET_DID,
} from '../../common/api-constants'

const qrSchema = {
  type: 'object',
  properties: {
    [QR_CODE_CHALLENGE]: { type: 'string' },
    [QR_CODE_SIGNATURE]: { type: 'string' },
  },
  required: [QR_CODE_CHALLENGE, QR_CODE_SIGNATURE],
}

const qrChallengeSchema = {
  type: 'object',
  properties: {
    [QR_CODE_UID]: { type: 'string' },
    [QR_CODE_REMOTE_HOSTING_DID]: { type: 'string' },
    [QR_CODE_REMOTE_PAIR_WISE_DID]: { type: 'string' },
    [QR_CODE_SENDER_NAME]: { type: 'string' },
    [QR_CODE_TARGET_NAME]: { type: 'string' },
    [QR_CODE_TARGET_DID]: { type: 'string' },
  },
  required: [
    QR_CODE_UID,
    QR_CODE_REMOTE_HOSTING_DID,
    QR_CODE_REMOTE_PAIR_WISE_DID,
    QR_CODE_SENDER_NAME,
    QR_CODE_TARGET_NAME,
    QR_CODE_TARGET_DID,
  ],
}

// this is the number that is max allowed by 200 X 200 qr code
// if we are getting more than that, then there is an issue from
// qr code generation site or someone is trying to break the app
const qrCodeAllowedLength = 1200

// If we need to use QR scanner somewhere else in app as well
// remove this method and create an equivalent in another
// component as well, for now this is good here
export function isValidQrCode(qr) {
  // check the length of qr data so that we don't get memory issues
  // while parsing the json
  if (qr.length >= qrCodeAllowedLength) {
    return false
  }

  let qrData
  try {
    qrData = JSON.parse(qr)
  } catch (e) {
    // qr code is not a valid json, we still return false
    return false
  }

  // check if qr code schema is valid
  if (!schemaValidator.validate(qrSchema, qrData)) {
    return false
  }

  let qrChallenge
  try {
    qrChallenge = JSON.parse(qrData.c)
  } catch (e) {
    return false
  }

  // check if qr code challenge schema is valid
  if (!schemaValidator.validate(qrChallengeSchema, qrChallenge)) {
    return false
  }

  // TODO:KS Check if signature is valid for qr code once libindy is integrated

  // since all checks are passed
  // qr code data is valid, send the parsed data back
  return {
    challenge: qrChallenge,
    signature: qrData.s,
    qrData,
  }
}

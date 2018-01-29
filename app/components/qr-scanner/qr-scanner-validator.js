// @flow
import schemaValidator from '../../services/schema-validator'
import {
  QR_CODE_SENDER_DID,
  QR_CODE_SENDER_VERIFICATION_KEY,
  QR_CODE_LOGO_URL,
  QR_CODE_REQUEST_ID,
  QR_CODE_SENDER_KEY_DELEGATION,
  QR_CODE_SENDER_NAME,
  QR_CODE_TARGET_NAME,
  QR_CODE_SENDER_DETAIL,
  QR_CODE_DELEGATION_DID,
  QR_CODE_DELEGATION_KEY,
  QR_CODE_DELEGATION_SIGNATURE,
  QR_CODE_SENDER_AGENCY,
  QR_CODE_SENDER_AGENCY_DID,
  QR_CODE_SENDER_AGENCY_KEY,
  QR_CODE_SENDER_AGENCY_ENDPOINT,
} from '../../api/api-constants'
import type { QrCode } from './type-qr-scanner'

const qrSchema = {
  type: 'object',
  properties: {
    [QR_CODE_REQUEST_ID]: { type: 'string' },
    [QR_CODE_SENDER_DETAIL]: {
      type: 'object',
      properties: {
        [QR_CODE_SENDER_DID]: { type: 'string' },
        [QR_CODE_SENDER_NAME]: { type: 'string' },
        [QR_CODE_LOGO_URL]: { type: 'string' },
        [QR_CODE_SENDER_VERIFICATION_KEY]: { type: 'string' },
        [QR_CODE_SENDER_KEY_DELEGATION]: {
          type: 'object',
          properties: {
            [QR_CODE_DELEGATION_DID]: { type: 'string' },
            [QR_CODE_DELEGATION_KEY]: { type: 'string' },
            [QR_CODE_DELEGATION_SIGNATURE]: { type: 'string' },
          },
          required: [
            QR_CODE_DELEGATION_DID,
            QR_CODE_DELEGATION_KEY,
            QR_CODE_DELEGATION_SIGNATURE,
          ],
        },
      },
      required: [
        QR_CODE_SENDER_DID,
        QR_CODE_SENDER_NAME,
        QR_CODE_LOGO_URL,
        QR_CODE_SENDER_VERIFICATION_KEY,
        QR_CODE_SENDER_KEY_DELEGATION,
      ],
    },
    [QR_CODE_SENDER_AGENCY]: {
      type: 'object',
      properties: {
        [QR_CODE_SENDER_AGENCY_DID]: { type: 'string' },
        [QR_CODE_SENDER_AGENCY_KEY]: { type: 'string' },
        [QR_CODE_SENDER_AGENCY_ENDPOINT]: { type: 'string' },
      },
      required: [
        QR_CODE_SENDER_AGENCY_DID,
        QR_CODE_SENDER_AGENCY_KEY,
        QR_CODE_SENDER_AGENCY_ENDPOINT,
      ],
    },
    [QR_CODE_TARGET_NAME]: { type: 'string' },
  },
  required: [
    QR_CODE_REQUEST_ID,
    QR_CODE_SENDER_DETAIL,
    QR_CODE_SENDER_AGENCY,
    QR_CODE_TARGET_NAME,
  ],
}

// this is the number that is max allowed by 200 X 200 qr code
// if we are getting more than that, then there is an issue from
// qr code generation site or someone is trying to break the app
const qrCodeAllowedLength = 1200

// If we need to use QR scanner somewhere else in app as well
// remove this method and create an equivalent in another
// component as well, for now this is good here
export function isValidQrCode(qr: string): QrCode | boolean {
  // check the length of qr data so that we don't get memory issues
  // while parsing the json
  if (qr.length >= qrCodeAllowedLength) {
    return false
  }

  let qrData: QrCode
  try {
    qrData = (JSON.parse(qr): QrCode)
  } catch (e) {
    // qr code is not a valid json, we still return false
    return false
  }

  // check if qr code schema is valid
  if (!schemaValidator.validate(qrSchema, qrData)) {
    return false
  }

  // since all checks are passed
  // qr code data is valid, send the parsed data back
  return qrData
}

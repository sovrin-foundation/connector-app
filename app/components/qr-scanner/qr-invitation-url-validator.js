// @flow

import urlParse from 'url-parse'
import type { InvitationUrlQrCode } from './type-qr-scanner'

// only trust if scheme is https, http is not allowed
export const validInvitationUrlScheme = 'https'

// maximum length allowed for whole url-qr-code
export const validInvitationUrlLength = 2048

export function isValidInvitationUrl(
  passedUrlString: string
): InvitationUrlQrCode | boolean {
  if (passedUrlString.length > validInvitationUrlLength) {
    return false
  }

  const { protocol } = urlParse(passedUrlString, {}, true)

  if (protocol !== `${validInvitationUrlScheme}:`) {
    return false
  }

  return {
    url: passedUrlString,
  }
}

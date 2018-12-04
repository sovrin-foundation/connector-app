// @flow
import urlParse from 'url-parse'
import type { EnvironmentSwitchUrlQrCode } from './type-qr-scanner'

// allow only this domain to be a valid url for a qr code
// if we don't find this as host, then we don't consider it valid
export const validUrlQrCodeHost = 's3-us-west-2.amazonaws.com'

// only trust if scheme is https, http is not allowed
export const validUrlQrCodeScheme = 'https'

// value of path name should not exceed this length
export const validUrlQrCodeUrlPathLength = 50

// maximum length allowed for whole url-qr-code
export const validUrlQrCodeLength = 120

// allow only characters and dash
export const urlQrQueryParamAllowedRegex = /^[a-zA-Z\-]+$/

export function isValidUrlQrCode(
  urlQrCode: string
): EnvironmentSwitchUrlQrCode | boolean {
  if (urlQrCode.length > validUrlQrCodeLength) {
    return false
  }

  const { protocol, hostname, pathname } = urlParse(urlQrCode, {}, true)

  if (protocol !== `${validUrlQrCodeScheme}:`) {
    return false
  }

  if (hostname !== validUrlQrCodeHost) {
    return false
  }

  if (!pathname) {
    return false
  }

  const paths = pathname.split('/')

  // take the last path name and that would be treated as environment name
  const environmentName = paths[paths.length - 1]

  if (!environmentName) {
    return false
  }

  if (environmentName.length > validUrlQrCodeUrlPathLength) {
    return false
  }

  if (urlQrQueryParamAllowedRegex.test(environmentName) === false) {
    return false
  }

  return {
    url: urlQrCode,
    name: environmentName,
  }
}

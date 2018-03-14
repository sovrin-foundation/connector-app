// @flow
import urlParse from 'url-parse'
import type { EnvironmentSwitchUrlQrCode } from './type-qr-scanner'

// allow only this domain to be a valid url for a qr code
// if we don't find this as host, then we don't consider it valid
export const validUrlQrCodeHost = 'shoddyexaltedoctagon--khageshsharma.repl.co'

// only trust if scheme is https, http is not allowed
export const validUrlQrCodeScheme = 'https'

// only want one query string named as `env`
export const validUrlQrCodeQueryParamName = 'env'

// value of query string should not exceed this length
export const validUrlQrCodeEnvironmentQueryParamLength = 50

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

  const { protocol, hostname, query: { env } = {} } = urlParse(
    urlQrCode,
    {},
    true
  )

  if (protocol !== `${validUrlQrCodeScheme}:`) {
    return false
  }

  if (hostname !== validUrlQrCodeHost) {
    return false
  }

  if (!env) {
    return false
  }

  if (env.length > validUrlQrCodeEnvironmentQueryParamLength) {
    return false
  }

  if (urlQrQueryParamAllowedRegex.test(env) === false) {
    return false
  }

  return {
    url: urlQrCode,
    name: env,
  }
}

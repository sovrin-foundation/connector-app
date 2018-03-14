// @flow

import { isValidUrlQrCode } from '../qr-url-validator'

describe('fn:isValidUrlQrCode', () => {
  // creating variables in test, so that our tests break if someone changes
  // scheme and hostname
  const validUrlQrCodeHost = 'connect-me-env-switch.connect.me'
  const validUrlQrCodeScheme = 'https'
  const validUrlQrCodeQueryParamName = 'env'

  const validOrigin = `${validUrlQrCodeScheme}://${validUrlQrCodeHost}/`

  // TODO: Remove when raising PR to master
  xit('should return url, when url is valid', () => {
    const name = 'dev'
    const urlQrCode = `${validOrigin}?${validUrlQrCodeQueryParamName}=${name}`
    expect(isValidUrlQrCode(urlQrCode)).toEqual({
      url: urlQrCode,
      name,
    })
  })

  // TODO: Remove when raising PR to master
  xit('should return url, when query param is valid', () => {
    const name = 'dev-dev-dev-dev'
    const urlQrCode = `${validOrigin}?${validUrlQrCodeQueryParamName}=${name}`
    expect(isValidUrlQrCode(urlQrCode)).toEqual({
      url: urlQrCode,
      name,
    })
  })

  it('should return false, if we pass an array in query string params', () => {
    const urlQrCode = `${validOrigin}?${validUrlQrCodeQueryParamName}=['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if we pass comma separated values in query string params', () => {
    const urlQrCode = `${validOrigin}?${validUrlQrCodeQueryParamName}=aaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaa`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if protocol is not https', () => {
    const urlQrCode = `http://${validUrlQrCodeHost}/?${validUrlQrCodeQueryParamName}=dev`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, hostname is invalid', () => {
    const urlQrCode = `${validUrlQrCodeScheme}://xyz.com/?${validUrlQrCodeQueryParamName}=dev`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if no query param is supplied', () => {
    const urlQrCode = `${validOrigin}`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if length of query param is more than expected', () => {
    const urlQrCode = `${validOrigin}?${validUrlQrCodeQueryParamName}=devdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdev`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if query param contains unwanted characters', () => {
    const urlQrCode = `${validOrigin}?${validUrlQrCodeQueryParamName}=devdevdevdevdevdevde9.`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })
})

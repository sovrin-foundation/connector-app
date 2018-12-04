// @flow

import { isValidUrlQrCode } from '../qr-url-validator'

describe('fn:isValidUrlQrCode', () => {
  // creating variables in test, so that our tests break if someone changes
  // scheme and hostname
  const validUrlQrCodeHost = 's3-us-west-2.amazonaws.com'
  const validUrlQrCodeScheme = 'https'

  const validOrigin = `${validUrlQrCodeScheme}://${validUrlQrCodeHost}/vcx-env`

  it('should return url, when url is valid', () => {
    const name = 'dev'
    const urlQrCode = `${validOrigin}/${name}`
    expect(isValidUrlQrCode(urlQrCode)).toEqual({
      url: urlQrCode,
      name,
    })
  })

  it('should return url, when path name is valid', () => {
    const name = 'dev-dev-dev-dev'
    const urlQrCode = `${validOrigin}/${name}`
    expect(isValidUrlQrCode(urlQrCode)).toEqual({
      url: urlQrCode,
      name,
    })
  })

  it('should return false, if we pass an array in pathname', () => {
    const urlQrCode = `${validOrigin}/['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if we pass comma separated values in path name', () => {
    const urlQrCode = `${validOrigin}/aaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaa`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if protocol is not https', () => {
    const urlQrCode = `http://${validUrlQrCodeHost}/dev`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, hostname is invalid', () => {
    const urlQrCode = `${validUrlQrCodeScheme}://xyz.com/dev`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if no path name is supplied', () => {
    const urlQrCode = `https://${validUrlQrCodeHost}/`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if length of path name is more than expected', () => {
    const urlQrCode = `${validOrigin}/devdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdev`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if path name contains unwanted characters', () => {
    const urlQrCode = `${validOrigin}/devdevdevdevdevdevde9.`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if spaces are added to url path', () => {
    const urlQrCode = `https://${validUrlQrCodeHost}/   `
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })

  it('should return false, if last path name is not specified', () => {
    const urlQrCode = `${validOrigin}/dev/`
    expect(isValidUrlQrCode(urlQrCode)).toBe(false)
  })
})

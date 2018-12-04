// @flow

import { isValidInvitationUrl } from '../qr-invitation-url-validator'

describe('fn:isValidInvitationUrl', () => {
  // creating variables in test, so that our tests break if someone changes
  const validOrigin = `https://some-domain.com/token`

  it('should return url, when url is valid', () => {
    const urlQrCode = `${validOrigin}`
    expect(isValidInvitationUrl(urlQrCode)).toEqual({
      url: urlQrCode,
    })
  })

  it('should return false, if we pass longer url than allowed', () => {
    const urlQrCode = `${validOrigin}/${'x'.repeat(2049)}`
    expect(isValidInvitationUrl(urlQrCode)).toBe(false)
  })

  it('should return correct url, if protocol is http', () => {
    const urlQrCode = `http://some.com/dev`
    expect(isValidInvitationUrl(urlQrCode)).toEqual({
      url: urlQrCode,
    })
  })

  it('should return false, if protocol is neither http or https', () => {
    const urlQrCode = `mail://some.com/dev`
    expect(isValidInvitationUrl(urlQrCode)).toBe(false)
  })
})

// @flow
import { isValidQrCode } from '../qr-scanner-validator'

describe('QR Scanner validator', () => {
  it('should return false if schema is not valid at top level', () => {
    const invalidQrSchemas = [
      { n: '' },
      { p: '' },
      { n: '', a: '' },
      { n: '', a: '' },
      { p: '', '1': '' },
      // invalid as per length
      {
        n: '',
        p: 'a'.repeat(1300),
      },
      // invalid at second level
      { p: JSON.stringify({ lu: '' }), n: '', sD: '', sVk: '' },
      { p: JSON.stringify({ lu: '', rid: '' }), n: '', sD: '', sVk: '' },
      {
        p: JSON.stringify({ lu: '', rid: '', sakdp: '' }),
        n: '',
        sD: '',
        sVk: '',
      },
      {
        p: JSON.stringify({ lu: '', rid: '', sakdp: '', sn: '' }),
        n: '',
        sD: '',
        sVk: '',
      },
      {
        p: JSON.stringify({ lu: '', rid: '', sakdp: '', sn: '', ts: '' }),
        n: '',
        sD: '',
        sVk: '',
      },
    ]

    invalidQrSchemas.map(schema =>
      expect(isValidQrCode(JSON.stringify(schema))).toBe(false)
    )
  })

  it('should return data for valid schema', () => {
    const validSchema = {
      lu: '',
      rid: '',
      sakdp: '',
      sn: '',
      tn: '',
      sD: '',
      sVk: '',
      e: '',
    }

    expect(isValidQrCode(JSON.stringify(validSchema))).toMatchSnapshot()
  })
})

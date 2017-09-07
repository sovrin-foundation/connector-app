import { isValidQrCode } from '../qr-scanner-validator'

describe('QR Scanner validator', () => {
  it('should return false if schema is not valid at top level', () => {
    const invalidQrSchemas = [
      { a: '' },
      { c: '' },
      { c: '', a: '' },
      { s: '', a: '' },
      { s: '', 1: '' },
      // invalid as per length
      {
        c: '',
        s: 'a'.repeat(1300),
      },
      // invalid at second level
      { c: JSON.stringify({ n: '' }), s: '' },
      { c: JSON.stringify({ n: '', rci: '' }), s: '' },
      { c: JSON.stringify({ n: '', rci: '', en: '' }), s: '' },
      { c: JSON.stringify({ n: '', rci: '', en: '', un: '' }), s: '' },
      { c: JSON.stringify({ n: '', rci: '', en: '', un: '', iic: '' }), s: '' },
    ]

    invalidQrSchemas.map(schema =>
      expect(isValidQrCode(JSON.stringify(schema))).toBe(false)
    )
  })

  it('should return data for valid schema', () => {
    const validSchema = {
      c: JSON.stringify({
        tDID: '',
        sn: '',
        tn: '',
        uid: '',
        rhDID: '',
        rpDID: '',
      }),
      s: '',
    }

    expect(isValidQrCode(JSON.stringify(validSchema))).toMatchSnapshot()
  })
})

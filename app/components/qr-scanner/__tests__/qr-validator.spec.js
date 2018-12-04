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
      id: 'yta2odh',
      s: {
        n: 'ent-name',
        dp: {
          d: 'N2Uyi6SVsHZq1VWXuA3EMg',
          k: 'CTfF2sZ5q4oPcBvTP75pgx3WGzYiLSTwHGg9zUsJJegi',
          s:
            '/FxHMzX8JaH461k1SI5PfyxF5KwBAe6VlaYBNLI2aSZU3APsiWBfvSC+mxBYJ/zAhX9IUeTEX67fj+FCXZZ2Cg==',
        },
        d: 'F2axeahCaZfbUYUcKefc3j',
        l: 'ent-logo-url',
        v: '74xeXSEac5QTWzQmh84JqzjuXc8yvXLzWKeiqyUnYokx',
      },
      sa: {
        d: 'BDSmVkzxRYGE4HKyMKxd1H',
        v: '6yUatReYWNSUfEtC2ABgRXmmLaxCyQqsjLwv2BomxsxD',
        e: '52.38.32.107:80/agency/msg',
      },
      t: 'there',
    }

    expect(isValidQrCode(JSON.stringify(validSchema))).toMatchSnapshot()
  })
})

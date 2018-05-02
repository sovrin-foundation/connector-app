// @flow
import { formatNumbers } from '../text'

const toFormatNumber = '1234567890.12345678901234567890'
const formattedNumber = '1,234,567,890.12345678901234567890'

describe('Check the functionality for the number format function', () => {
  it('should return the proper formatted text', () => {
    expect(formatNumbers(toFormatNumber)).toEqual(formattedNumber)
  })
})

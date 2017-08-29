// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import PinCodeDigit from '../pin-code-digit'
import type { PinCodeDigitProps } from '../type-pin-code-box'

describe('<PinCodeDigit />', () => {
  it('when digit is entered', () => {
    const wrapper = renderer.create(<PinCodeDigit entered />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('when digit is not entered', () => {
    const wrapper = renderer.create(<PinCodeDigit entered={false} />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

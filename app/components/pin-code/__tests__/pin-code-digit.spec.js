// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import PinCodeDigit from '../pin-code-digit'
import type { PinCodeDigitProps } from '../type-pin-code-box'

describe('<PinCodeDigit />', () => {
  let onPress
  beforeEach(() => {
    onPress = jest.fn()
  })

  it('when digit is entered', () => {
    const wrapper = renderer
      .create(<PinCodeDigit entered onPress={onPress} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('when digit is not entered', () => {
    const wrapper = renderer
      .create(<PinCodeDigit entered={false} onPress={onPress} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

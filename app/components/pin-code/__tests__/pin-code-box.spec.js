// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import PinCodeBox from '../pin-code-box'
import type { PinCodeBoxProps } from '../type-pin-code-box'

describe('<PinCodeBox />', () => {
  let onPinComplete, wrapper, component

  beforeEach(() => {
    onPinComplete = jest.fn()
    component = renderer.create(<PinCodeBox onPinComplete={onPinComplete} />)
    wrapper = component.toJSON()
  })

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should show two sovrin symbol if two digits are entered', () => {
    const pinBox = component.getInstance()
    // set state to enter two digits
    pinBox.setState({ pin: '12' })
    const expectedTree = component.toJSON()
    expect(expectedTree).toMatchSnapshot()
  })
})

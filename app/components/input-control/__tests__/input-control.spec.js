// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import ControlInput from '../input-control'

describe('<WalletTabSendDetails />', () => {
  let onChangeText = jest.fn()
  let validation = jest.fn()
  function setup() {
    const component = renderer.create(
      <ControlInput
        onChangeText={onChangeText}
        placeholder="test"
        label="To"
        name="paymentTo"
        multiline={false}
        validation={validation}
        isValid={'IDLE'}
      />
    )
    const instance = component.root.findByType(ControlInput).instance
    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

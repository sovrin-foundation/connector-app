// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import WalletSendAmount from '../wallet-send-amount'

describe('<WalletSendAmount />', () => {
  function setup() {
    const component = renderer.create(<WalletSendAmount />)
    const instance = component.getInstance()

    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

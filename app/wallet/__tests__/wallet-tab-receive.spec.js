// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import WalletTabReceive from '../wallet-tab-receive'
import { walletAddressess } from '../../../__mocks__/static-data'

describe('<WalletTabReceive />', () => {
  function setup() {
    const component = renderer.create(<WalletTabReceive />)
    const instance = component.getInstance()

    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import WalletSendAmount from '../wallet-send-amount'
import { getNavigation } from '../../../__mocks__/static-data'

describe('<WalletSendAmount />', () => {
  let outerNavigation = {
    navigation: getNavigation(),
  }
  let navigation = {
    ...getNavigation(),
  }
  function setup() {
    const component = renderer.create(
      <WalletSendAmount screenProps={outerNavigation} navigation={navigation} />
    )
    const instance = component.getInstance()

    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

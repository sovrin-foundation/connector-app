// @flow
import 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import WalletSendAmount from '../wallet-send-amount'
import { getNavigation, getStore } from '../../../__mocks__/static-data'

describe('<WalletSendAmount />', () => {
  let outerNavigation = {
    navigation: getNavigation(),
  }
  let navigation = {
    ...getNavigation(),
  }
  let selectTokenAmount = jest.fn()
  function setup() {
    const component = renderer.create(
      <Provider store={getStore()}>
        <WalletSendAmount
          screenProps={outerNavigation}
          navigation={navigation}
          selectTokenAmount={selectTokenAmount}
        />
      </Provider>
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

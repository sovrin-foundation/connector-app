// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { walletRoute } from '../../common'
import { Wallet } from '../wallet'
import { getNavigation, getStore } from '../../../__mocks__/static-data'

function props() {
  return {
    navigation: getNavigation(),
    route: {
      currentScreen: walletRoute,
    },
  }
}

describe('<Wallet />', () => {
  const store = getStore()

  jest.useFakeTimers()

  it('should render Wallet', () => {
    const walletProps = props()
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <Wallet {...walletProps} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

// @flow

import React from 'react'
import { Provider } from 'react-redux'
import { View, Text } from 'react-native'
import renderer from 'react-test-renderer'
import WalletBalance from '../wallet-balance'
import { getStore } from '../../../__mocks__/static-data'

describe('<WalletBalance />', () => {
  it('should render WalletBalance', () => {
    const wrapper = renderer
      .create(
        <Provider store={getStore()}>
          <WalletBalance
            render={balance => (
              <View>
                <Text>{balance}</Text>
              </View>
            )}
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

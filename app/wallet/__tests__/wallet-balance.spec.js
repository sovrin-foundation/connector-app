// @flow

import React from 'react'
import { View, Text } from 'react-native'
import renderer from 'react-test-renderer'
import WalletBalance from '../wallet-balance'

describe('<WalletBalance />', () => {
  it('should render WalletBalance', () => {
    const wrapper = renderer
      .create(
        <WalletBalance
          render={balance => (
            <View>
              <Text>{balance}</Text>
            </View>
          )}
        />
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

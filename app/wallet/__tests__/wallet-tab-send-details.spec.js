// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { WalletTabSendDetails } from '../wallet-tab-send-details'
import { getStore } from '../../../__mocks__/static-data'
import { getNavigation, smsToken } from '../../../__mocks__/static-data'
import { STORE_STATUS } from '../type-wallet'

describe('<WalletTabSendDetails />', () => {
  const store = getStore()
  let navigation = {
    ...getNavigation(),
  }

  function setup() {
    const component = renderer.create(
      <Provider store={store}>
        <WalletTabSendDetails
          tokenAmount="12345"
          tokenSentStatus={STORE_STATUS.SUCCESS}
          navigation={navigation}
          sendTokens={jest.fn()}
        />
      </Provider>
    )
    const instance = component.root.findByType(WalletTabSendDetails).instance
    return { component, instance }
  }

  it('should render properly and match the snapshot', () => {
    const { component, instance } = setup()
    instance.onTextChange('pay:sov:somepaymentaddress', 'paymentTo')
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

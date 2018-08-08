// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { WalletTabReceive } from '../wallet-tab-receive'
import { Clipboard } from 'react-native'
import { walletAddresses, getStore } from '../../../__mocks__/static-data'
import { STORE_STATUS } from '../type-wallet'

describe('<WalletTabReceive />', () => {
  const store = getStore()
  function setup() {
    const component = renderer.create(
      <Provider store={store}>
        <WalletTabReceive
          walletAddresses={walletAddresses.data}
          refreshWalletAddresses={jest.fn()}
          promptBackupBanner={jest.fn()}
          addressStatus={STORE_STATUS.IN_PROGRESS}
        />
      </Provider>
    )
    const instance = component.root.findByType(WalletTabReceive).instance
    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('should call Clipboard.setString', () => {
    const { instance } = setup()
    const copyToClipboard = jest.spyOn(Clipboard, 'setString')
    instance.copyToClipboard()
    expect(copyToClipboard).toHaveBeenCalledWith(walletAddresses.data[0])
    copyToClipboard.mockReset()
    copyToClipboard.mockRestore()
  })
})

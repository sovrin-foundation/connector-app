// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { WalletTabHistory } from '../wallet-tab-history'
import { walletHistory } from '../../../__mocks__/static-data'
import { STORE_STATUS } from '../type-wallet'

describe('<WalletTabHistory />', () => {
  it('should render properly and match the snapshot', () => {
    const component = renderer.create(
      <WalletTabHistory
        walletHistory={walletHistory}
        refreshWalletHistory={jest.fn()}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render no history view properly and match the snapshot', () => {
    const noHistory = {
      transactions: [],
      status: STORE_STATUS.IDLE,
      error: null,
    }
    const component = renderer.create(
      <WalletTabHistory
        walletHistory={noHistory}
        refreshWalletHistory={jest.fn()}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

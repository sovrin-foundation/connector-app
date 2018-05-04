// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { WalletTabHistory } from '../wallet-tab-history'
import { walletHistory } from '../../../__mocks__/static-data'

describe('<WalletTabHistory />', () => {
  it('should render properly and match the snapshot', () => {
    const component = renderer.create(
      <WalletTabHistory walletHistory={walletHistory} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render no history view properly and match the snapshot', () => {
    const noHistory = []
    const component = renderer.create(
      <WalletTabHistory walletHistory={noHistory} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

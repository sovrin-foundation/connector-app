// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectionHistoryPending } from '../connection-history-pending'
import {
  getStore,
  senderLogoUrl,
  getNavigation,
} from '../../../__mocks__/static-data'

describe('<ConnectionHistoryPendings />', () => {
  const store = getStore()
  let getProps = () => ({
    navigation: getNavigation({
      payload: {
        issuer: 'issuer',
        data: { name: 'requester' },
        senderLogoUrl,
      },
    }),
  })

  it('should ConnectionHistoryPending render properly', () => {
    let props = getProps()
    const component = renderer.create(
      <Provider store={store}>
        <ConnectionHistoryPending {...props} />
      </Provider>
    )
    expect(component).toMatchSnapshot()
  })
  it('should redirect previous screen is close is called', () => {
    let props = getProps()
    const component = renderer.create(
      <Provider store={store}>
        <ConnectionHistoryPending {...props} />
      </Provider>
    )
    const componentInstance = component.root.findByType(
      ConnectionHistoryPending
    ).instance
    componentInstance.close()
    expect(props.navigation.goBack).toHaveBeenCalled()
  })
})

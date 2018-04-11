// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectionHistoryDetails } from '../connection-history-details'
import {
  getStore,
  senderLogoUrl,
  claimMap,
  activeConnectionThemePrimary,
  connectionHistoryDetail,
} from '../../../__mocks__/static-data'

describe('<ConnectionHistoryDetails />', () => {
  const store = getStore()
  function props() {
    return {
      navigation: {
        state: {
          params: connectionHistoryDetail,
        },
      },
    }
  }

  it('should ConnectionHistoryDetails render properly', () => {
    const component = renderer.create(
      <Provider store={store}>
        <ConnectionHistoryDetails {...props()} />
      </Provider>
    )
    expect(component).toMatchSnapshot()
  })
})

// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Settings } from '../settings'
import { getStore, getNavigation } from '../../../__mocks__/static-data'

describe('user settings screen', () => {
  const store = getStore()

  function getProps() {
    return {
      walletBackup: {
        encryptionKey: 'walletEncryptionKey',
        status: 'IDLE',
      },
      navigation: getNavigation(),
      selectUserAvatar: jest.fn(),
      touchIdActive: false,
      navigationOptions: jest.fn(),
    }
  }

  function setup() {
    const props = getProps()
    return { props }
  }

  it('should render properly and snapshot should match', () => {
    const { props } = setup()
    const tree = renderer
      .create(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

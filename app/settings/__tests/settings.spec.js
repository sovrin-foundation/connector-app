// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Settings } from '../settings'
import { getStore, getNavigation } from '../../../__mocks__/static-data'
import { settingsRoute } from '../../common'

describe('user settings screen', () => {
  const store = getStore()

  function getProps() {
    return {
      walletBackup: {
        encryptionKey: 'walletEncryptionKey',
        status: 'IDLE',
      },
      timeStamp: new Date().getTime(),
      currentScreen: settingsRoute,
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

  it('should render properly and snapshot should match ios platform', () => {
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
  it('should render properly and snapshot should match for android platform', () => {
    const platform = jest.mock('Platform', () => {
      const Platform = jest.requireActual('Platform')
      Platform.OS = 'android'
      return Platform
    })
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

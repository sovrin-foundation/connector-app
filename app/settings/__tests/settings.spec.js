import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { Settings } from '../settings'
import { getStore } from '../../../__mocks__/static-data'

describe('user settings screen', () => {
  const store = getStore()

  it('should render properly and snapshot should match', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Settings
            walletBackup={{
              encryptionKey: 'walletEncryptionKey',
              status: 'IDLE',
            }}
          />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

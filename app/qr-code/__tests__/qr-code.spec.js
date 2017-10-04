import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { homeRoute } from '../../common/'
import { QRCodeScannerScreen } from '../qr-code'

describe('<QRScannerScreen />', () => {
  let store = {}

  beforeAll(() => {
    store = {
      getState() {
        return {
          route: {
            currentScreen: homeRoute,
          },
        }
      },
      subscribe() {
        return jest.fn()
      },
      dispatch() {
        return jest.fn()
      },
    }
  })

  it('should match snapshot', () => {
    const component = renderer.create(
      <Provider store={store}>
        <QRCodeScannerScreen />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

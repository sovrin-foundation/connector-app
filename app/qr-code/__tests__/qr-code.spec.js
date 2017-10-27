// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import {
  qrCodeScannerTabRoute,
  qrConnectionRequestRoute,
  homeTabRoute,
} from '../../common/'
import ConnectedQRCodeScannerScreen, { QRCodeScannerScreen } from '../qr-code'

describe('<QRScannerScreen />', () => {
  let store = {}
  let dispatch
  let navigation

  beforeAll(() => {
    dispatch = jest.fn()
    store = {
      getState() {
        return {
          route: {
            currentScreen: qrCodeScannerTabRoute,
          },
        }
      },
      subscribe() {
        return jest.fn()
      },
      dispatch,
    }
    navigation = {
      navigate: jest.fn(),
    }
  })

  it('should match snapshot', () => {
    const component = renderer.create(
      <Provider store={store}>
        <ConnectedQRCodeScannerScreen />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should redirect user to qr-connection-request screen on success read', () => {
    const qrConnectionRequestReceived = jest.fn()
    const instance = renderer
      .create(
        <QRCodeScannerScreen
          qrConnectionRequestReceived={qrConnectionRequestReceived}
          navigation={navigation}
          currentScreen={qrCodeScannerTabRoute}
        />
      )
      .getInstance()

    const qrData = {
      lu: 'http://logourl.com',
      rid: 'requestid',
      sakdp: 'senderAgentKeyDlgProof',
      sn: 'senderName',
      tn: 'targetName',
      sD: 'senderDID',
      sVk: 'senderVerificationKey',
    }

    instance.onRead(qrData)
    expect(qrConnectionRequestReceived).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: qrData,
        title: `Hi ${qrData['tn']}`,
        message: `${qrData['sn']} wants to connect with you`,
      })
    )
    expect(navigation.navigate).toHaveBeenCalledWith(qrConnectionRequestRoute)
  })

  it('should navigate back to home if qr code scanner is closed', () => {
    const instance = renderer
      .create(<QRCodeScannerScreen navigation={navigation} />)
      .getInstance()
    instance.onClose()
    expect(navigation.navigate).toHaveBeenCalledWith(homeTabRoute)
  })
})

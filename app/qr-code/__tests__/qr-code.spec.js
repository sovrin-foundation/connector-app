// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import {
  qrCodeScannerTabRoute,
  invitationRoute,
  homeTabRoute,
} from '../../common/'
import ConnectedQRCodeScannerScreen, {
  QRCodeScannerScreen,
  convertQrCodeToInvitation,
} from '../qr-code'

describe('<QRScannerScreen />', () => {
  let store = {}
  let dispatch
  let navigation
  const qrData = {
    lu: 'http://logourl.com',
    rid: 'requestid',
    sakdp: 'senderAgentKeyDlgProof',
    sn: 'senderName',
    tn: 'targetName',
    sD: 'senderDID',
    sVk: 'senderVerificationKey',
    e: 'https://endpoint.com',
  }

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

  it('should convert qr code to invitation', () => {
    expect(convertQrCodeToInvitation(qrData)).toMatchSnapshot()
  })

  it('should redirect user to invitation screen on success read', () => {
    const invitationReceived = jest.fn()
    const instance = renderer
      .create(
        <QRCodeScannerScreen
          invitationReceived={invitationReceived}
          navigation={navigation}
          currentScreen={qrCodeScannerTabRoute}
        />
      )
      .getInstance()

    instance.onRead(qrData)
    expect(invitationReceived).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: convertQrCodeToInvitation(qrData),
      })
    )
    expect(navigation.navigate).toHaveBeenCalledWith(invitationRoute, {
      senderDID: qrData.sD,
    })
  })

  it('should navigate back to home if qr code scanner is closed', () => {
    const instance = renderer
      .create(<QRCodeScannerScreen navigation={navigation} />)
      .getInstance()
    instance.onClose()
    expect(navigation.navigate).toHaveBeenCalledWith(homeTabRoute)
  })
})

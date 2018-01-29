// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import {
  qrCodeScannerTabRoute,
  invitationRoute,
  homeTabRoute,
} from '../../common/'
import { QRCodeScannerScreen, convertQrCodeToInvitation } from '../qr-code'
import { getNavigation, qrData } from '../../../__mocks__/static-data'

describe('<QRScannerScreen />', () => {
  let navigation
  let invitationReceived
  let component

  beforeEach(() => {
    navigation = getNavigation()
    invitationReceived = jest.fn()
    component = renderer.create(
      <QRCodeScannerScreen
        invitationReceived={invitationReceived}
        navigation={navigation}
        currentScreen={qrCodeScannerTabRoute}
      />
    )
  })

  it('should match snapshot', () => {
    const instance = component.getInstance()
    instance.setState({ isCameraAuthorized: true })

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('match snapshot when camera is not authorized', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should convert qr code to invitation', () => {
    expect(convertQrCodeToInvitation(qrData)).toMatchSnapshot()
  })

  it('should redirect user to invitation screen on success read', () => {
    const instance = component.getInstance()

    instance.onRead(qrData)
    expect(invitationReceived).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: convertQrCodeToInvitation(qrData),
      })
    )
    expect(navigation.navigate).toHaveBeenCalledWith(invitationRoute, {
      senderDID: qrData.s.d,
    })
  })

  it('should navigate back to home if qr code scanner is closed', () => {
    const instance = component.getInstance()
    instance.onClose()
    expect(navigation.navigate).toHaveBeenCalledWith(homeTabRoute)
  })
})

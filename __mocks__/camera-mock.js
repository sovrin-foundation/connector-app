// @flow
import React from 'react'
import { View } from 'react-native'

const constants = {
  Aspect: {},
  BarCodeType: {},
  Type: {},
  CaptureMode: {},
  CaptureTarget: {},
  CaptureQuality: {},
  Orientation: {},
  FlashMode: {},
  TorchMode: {},
}

class MockCamera extends React.Component {
  static constants = constants
  static checkVideoAuthorizationStatus = jest.fn(() => Promise.resolve(true))

  render() {
    return <View>{this.props.children}</View>
  }
}

MockCamera.constants = constants

export default MockCamera

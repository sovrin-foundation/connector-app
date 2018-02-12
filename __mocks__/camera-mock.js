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

// We don't need to type check external library
// and we don't need types for mock test stub
class MockCamera extends React.Component<any, void> {
  static constants = constants
  static checkVideoAuthorizationStatus = jest.fn(() => Promise.resolve(true))

  render() {
    return <View>{this.props.children}</View>
  }
}

MockCamera.constants = constants

export default MockCamera

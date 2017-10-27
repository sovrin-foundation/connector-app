import React from 'react'
import { View } from 'react-native'

const constants = (constants = {
  Aspect: {},
  BarCodeType: {},
  Type: {},
  CaptureMode: {},
  CaptureTarget: {},
  CaptureQuality: {},
  Orientation: {},
  FlashMode: {},
  TorchMode: {},
})

class MockCamera extends React.Component {
  static constants = constants

  render() {
    return <View>{this.props.children}</View>
  }
}

MockCamera.constants = constants

export default MockCamera

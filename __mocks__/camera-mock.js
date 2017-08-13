import React from 'react'

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
    return null
  }
}

MockCamera.constants = constants

export default MockCamera

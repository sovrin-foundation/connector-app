import React, { PureComponent } from 'react'
import { Vibration, StyleSheet, View, Dimensions } from 'react-native'
import Camera from 'react-native-camera'
import { CustomView, Container, CustomText } from '../../components/'
import { color, OFFSET_2X } from '../../common/styles/constant'
import { isValidQrCode } from './qr-scanner-validator'

const SCAN_STATUS = {
  SCANNING: 'scanning...',
  SUCCESS: 'Success!',
  FAIL: 'Failed to scan QR code',
}

export default class QRScanner extends PureComponent {
  constructor(props) {
    super(props)

    this.initialState = {
      // this flag is used to restrict camera to keep on scanning QR codes
      // if this is set to false, only then we
      scanning: false,
      scanStatus: SCAN_STATUS.SCANNING,
    }

    this.state = this.initialState
  }

  reactivateScanning = () => {
    // this method sets scanning status
    // so that we stop accepting qr code scans and user can see
    // "scanning..." text, otherwise as soon as we set state
    // in "reactivate" function, "scanning..." text will disappear and it looks bad
    setTimeout(() => this.setState({ scanning: false }), 2000)
  }

  reactivate = () => {
    this.setState(
      {
        scanStatus: SCAN_STATUS.SCANNING,
      },
      this.reactivateScanning
    )
  }

  delayedReactivate = () => {
    // no anonymous function to save closure to avoid memory leak
    setTimeout(() => this.reactivate(), 3000)
  }

  onRead = event => {
    if (!this.state.scanning) {
      const qrData = isValidQrCode(event.data)
      let nextState = { scanning: true }

      if (qrData) {
        nextState.scanStatus = SCAN_STATUS.SUCCESS
        this.setState(nextState)
        this.props.onRead(qrData)
        // set state back to initial state
        // once user is redirected to invitation screen
        setTimeout(this.delayedReactivate, 1000)
      } else {
        // qr code read failed
        nextState.scanStatus = SCAN_STATUS.FAIL
        // if qr code read failed, we reactivate qr code scan after delay
        // so that user can see that QR code scan failed
        this.setState(nextState, this.delayedReactivate)
      }
    }
  }

  // how do we kill the instance of the component
  // we need to add some hook with StackNavigator

  render() {
    return (
      <Container>
        <Camera onBarCodeRead={this.onRead} style={[cameraStyle.camera]}>
          <CameraMarker status={this.state.scanStatus} />
        </Camera>
      </Container>
    )
  }
}

export class CameraMarker extends PureComponent {
  render() {
    const { status } = this.props

    return (
      <CustomView center style={[cameraMarkerStyles.container]}>
        <CustomText h01 transparentBg>Scan QR Code</CustomText>
        <CustomView
          transparentBg
          spaceBetween
          style={[cameraMarkerStyles.cameraMarker]}
        >
          <CustomView row spaceBetween>
            <CornerBox status={status} position="topLeft" />
            <CornerBox status={status} position="topRight" />
          </CustomView>
          <CustomView row spaceBetween>
            <CornerBox status={status} position="bottomLeft" />
            <CornerBox status={status} position="bottomRight" />
          </CustomView>
        </CustomView>
        <CustomText h2 transparentBg style={[scanStatusStyle[status]]}>
          {status}
        </CustomText>
        <CustomView
          style={[cameraMarkerStyles.container, cameraMarkerStyles.overlay]}
        />
      </CustomView>
    )
  }
}

export class CornerBox extends PureComponent {
  render() {
    const { status } = this.props
    const borderStyle = status === SCAN_STATUS.SUCCESS
      ? cameraMarkerStyles.borderSuccess
      : status === SCAN_STATUS.FAIL
          ? cameraMarkerStyles.borderFail
          : cameraMarkerStyles.border

    return (
      <CustomView
        transparentBg
        style={[
          cameraMarkerStyles.cornerBox,
          cameraMarkerStyles[`${this.props.position}Box`],
          borderStyle,
        ]}
      />
    )
  }
}

const markerSize = 250
const cornerBoxSize = 50
const cornerBoxBorderSize = 5

const cameraMarkerStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    zIndex: -1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  cameraMarker: {
    width: markerSize,
    height: markerSize,
    marginVertical: OFFSET_2X,
  },
  border: {
    borderColor: color.bg.primary.font.primary,
  },
  borderSuccess: {
    borderColor: color.actions.primary,
  },
  borderFail: {
    borderColor: color.actions.dangerous,
  },
  cornerBox: {
    width: cornerBoxSize,
    height: cornerBoxSize,
  },
  topLeftBox: {
    borderTopWidth: cornerBoxBorderSize,
    borderLeftWidth: cornerBoxBorderSize,
  },
  topRightBox: {
    borderTopWidth: cornerBoxBorderSize,
    borderRightWidth: cornerBoxBorderSize,
  },
  bottomLeftBox: {
    borderBottomWidth: cornerBoxBorderSize,
    borderLeftWidth: cornerBoxBorderSize,
  },
  bottomRightBox: {
    borderBottomWidth: cornerBoxBorderSize,
    borderRightWidth: cornerBoxBorderSize,
  },
})

const cameraStyle = StyleSheet.create({
  camera: {
    // magical number 72 is set here due to footer height
    // we want our QR code to go behind the footer slightly
    // but at the same time we want qr scan status to stay sufficient above footer
    // without margin or padding, by setting height
    // we automatically align qr scanner using flex
    height: Dimensions.get('screen').height - 72,
    backgroundColor: 'transparent',
  },
})

const scanStatusStyle = StyleSheet.create({
  [SCAN_STATUS.SCANNING]: {
    color: color.actions.none,
  },
  [SCAN_STATUS.SUCCESS]: {
    color: color.actions.primary,
  },
  [SCAN_STATUS.FAIL]: {
    color: color.actions.dangerous,
  },
})

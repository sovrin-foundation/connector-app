// @flow
import React, { PureComponent } from 'react'
import { Vibration, StyleSheet, View, Dimensions, Platform } from 'react-native'
import Camera from 'react-native-camera'
import { CustomView, Container, CustomText, Icon } from '../../components/'
import {
  color,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_5X,
} from '../../common/styles/constant'
import { isValidQrCode } from './qr-scanner-validator'
import {
  SCAN_STATUS,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
  TOP_RIGHT,
  TOP_LEFT,
} from './type-qr-scanner'
import type {
  QrScannerProps,
  QrScannerState,
  CameraMarkerProps,
  CornerBoxProps,
} from './type-qr-scanner'
import { isValidUrlQrCode } from './qr-url-validator'
import { isValidInvitationUrl } from './qr-invitation-url-validator'
import { invitationDetailsRequest } from '../../api/api'
import { convertSmsPayloadToInvitation } from '../../sms-pending-invitation/sms-pending-invitation-store'
import type { SMSPendingInvitationPayload } from '../../sms-pending-invitation/type-sms-pending-invitation'

export default class QRScanner extends PureComponent<
  QrScannerProps,
  QrScannerState
> {
  state = {
    // this flag is used to restrict camera to keep on scanning QR codes
    // if this is set to false, only then we
    scanning: false,
    scanStatus: SCAN_STATUS.SCANNING,
    cameraActive: true,
  }

  // Need to have this property because we can't rely
  // on state being updated immediately
  // so, while state being updated by react asynchronously,
  // onRead can be called multiple times and we don't want it
  isScanning = false

  // we queue few async tasks by assuming that camera might still be active
  // however, if this component is unmounted before we could call timers
  // then we possibly might have memory leak and React issue of updating
  // state on unmounted components
  timers = []

  reactivateScanning = () => {
    // this method sets scanning status
    // so that we stop accepting qr code scans and user can see
    // "scanning..." text, otherwise as soon as we set state
    // in "reactivate" function, "scanning..." text will disappear and it looks bad
    const reactivateTimer = setTimeout(() => {
      this.setState({ scanning: false })
      this.isScanning = false
    }, 2000)
    this.timers.push(reactivateTimer)
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
    const delayedTimer = setTimeout(this.reactivate, 3000)
    this.timers.push(delayedTimer)
  }

  onSuccessRead = (nextState: QrScannerState) => {
    nextState.scanStatus = SCAN_STATUS.SUCCESS
    nextState.cameraActive = false
    this.setState(nextState)
    // reset state after work is done
    // expectation is that parent will finish it's work within this timeout
    this.delayedReactivate()
  }

  componentWillUnmount() {
    this.timers.map(clearTimeout)
    this.timers = []
  }

  onRead = async (event: {| data: string |}) => {
    if (!this.state.scanning && !this.isScanning) {
      // set this instance property to avoid async state issue
      this.isScanning = true

      const qrData = isValidQrCode(event.data)
      let nextState = { scanning: true, scanStatus: SCAN_STATUS.SCANNING }

      if (qrData && typeof qrData === 'object') {
        this.onSuccessRead(nextState)
        this.props.onRead(qrData)
      } else {
        // we support another type of qr code as well
        // in which we recognize the url which allows us
        // to switch environment
        const urlQrCode = isValidUrlQrCode(event.data)
        if (urlQrCode && typeof urlQrCode === 'object') {
          this.onSuccessRead(nextState)
          this.props.onEnvironmentSwitchUrl(urlQrCode)
        } else {
          // now check if we get invitation url in qr-code
          const urlInvitationQrCode = isValidInvitationUrl(event.data)
          if (urlInvitationQrCode && typeof urlInvitationQrCode === 'object') {
            nextState.scanStatus = SCAN_STATUS.DOWNLOADING_INVITATION
            this.setState(nextState)
            try {
              const invitationData: SMSPendingInvitationPayload = await invitationDetailsRequest(
                {
                  url: urlInvitationQrCode.url,
                }
              )
              const invitationPayload = convertSmsPayloadToInvitation(
                invitationData
              )
              nextState.scanStatus = SCAN_STATUS.SUCCESS
              this.onSuccessRead(nextState)
              this.props.onInvitationUrl(invitationPayload)
            } catch (e) {
              // set status that no invitation data was found at the url
              nextState.scanStatus = SCAN_STATUS.NO_INVITATION_DATA
              // re-activate scanning after setting fail status
              this.setState(nextState, this.delayedReactivate)
            }
          } else {
            // qr code read failed
            nextState.scanStatus = SCAN_STATUS.FAIL
            // if qr code read failed, we reactivate qr code scan after delay
            // so that user can see that QR code scan failed
            this.setState(nextState, this.delayedReactivate)
          }
        }
      }
    }
  }

  render() {
    return (
      <Container>
        {this.state.cameraActive ? (
          <Camera onBarCodeRead={this.onRead} style={[cameraStyle.camera]}>
            <CameraMarker
              status={this.state.scanStatus}
              onClose={this.props.onClose}
            />
          </Camera>
        ) : null}
      </Container>
    )
  }
}
export class CameraMarker extends PureComponent<CameraMarkerProps, void> {
  render() {
    const { status, onClose } = this.props

    return (
      <CustomView center style={[cameraMarkerStyles.container]}>
        <CustomText h4 semiBold transparentBg>
          Scan QR Code
        </CustomText>
        <CustomView
          transparentBg
          spaceBetween
          style={[cameraMarkerStyles.cameraMarker]}
        >
          <CustomView row spaceBetween>
            <CornerBox status={status} position={TOP_LEFT} />
            <CornerBox status={status} position={TOP_RIGHT} />
          </CustomView>
          <CustomView row spaceBetween>
            <CornerBox status={status} position={BOTTOM_LEFT} />
            <CornerBox status={status} position={BOTTOM_RIGHT} />
          </CustomView>
        </CustomView>
        <CustomView
          style={[cameraMarkerStyles.container, cameraMarkerStyles.overlay]}
        />
        <CustomText
          h5
          semiBold
          transparentBg
          // $FlowFixMe
          style={[scanStatusStyle[status], scanStatusStyle.scanStatusOffset]}
        >
          {status}
        </CustomText>
        <CustomView
          row
          center
          style={[closeIconStyle.closeIcon]}
          testID={'close-qr-scanner-container'}
        >
          <Icon
            src={require('../../images/close_white.png')}
            testID={'close-qr-scanner-icon'}
            onPress={onClose}
            small
          />
        </CustomView>
      </CustomView>
    )
  }
}

export class CornerBox extends PureComponent<CornerBoxProps, void> {
  render() {
    const { status } = this.props
    const borderStyle =
      status === SCAN_STATUS.SUCCESS ||
      status === SCAN_STATUS.DOWNLOADING_INVITATION
        ? cameraMarkerStyles.borderSuccess
        : status === SCAN_STATUS.FAIL ||
          status === SCAN_STATUS.NO_INVITATION_DATA
          ? cameraMarkerStyles.borderFail
          : cameraMarkerStyles.border

    return (
      <CustomView
        transparentBg
        style={[
          cameraMarkerStyles.cornerBox,
          // $FlowFixMe
          cameraMarkerStyles[`${this.props.position}Box`],
          borderStyle,
        ]}
      />
    )
  }
}

const markerSize = 250
const cornerBoxSize = 70
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
    marginVertical: OFFSET_5X,
  },
  border: {
    borderColor: color.bg.primary.font.primary,
  },
  borderSuccess: {
    borderColor: color.actions.tertiary,
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
    // magical number 50 can be set here due to footer height
    // we want our QR code to go behind the footer slightly
    // but at the same time we want qr scan status to stay sufficient above footer
    // without margin or padding, by setting height
    // we automatically align qr scanner using flex
    height: Dimensions.get('screen').height,
    backgroundColor: 'transparent',
  },
})

const scanStatusStyle = StyleSheet.create({
  [SCAN_STATUS.SCANNING]: {
    color: color.actions.none,
  },
  [SCAN_STATUS.SUCCESS]: {
    color: color.actions.tertiary,
  },
  [SCAN_STATUS.FAIL]: {
    color: color.actions.dangerous,
  },
  [SCAN_STATUS.DOWNLOADING_INVITATION]: {
    color: color.actions.tertiary,
  },
  [SCAN_STATUS.NO_INVITATION_DATA]: {
    color: color.actions.dangerous,
  },
  scanStatusOffset: {
    marginVertical: OFFSET_3X,
  },
})

const closeIconStyle = StyleSheet.create({
  closeIcon: {
    marginVertical: OFFSET_2X,
  },
})

// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Camera from 'react-native-camera'
import { Alert } from 'react-native'
import { Container, QRScanner } from '../components'
import { color, barStyleLight } from '../common/styles/constant'
import { invitationReceived } from '../store'
import {
  PENDING_CONNECTION_REQUEST_CODE,
  QR_CODE_SENDER_DID,
  QR_CODE_SENDER_VERIFICATION_KEY,
  QR_CODE_LOGO_URL,
  QR_CODE_REQUEST_ID,
  QR_CODE_SENDER_NAME,
  QR_CODE_TARGET_NAME,
  QR_CODE_SENDER_DETAIL,
  QR_CODE_SENDER_KEY_DELEGATION,
  QR_CODE_DELEGATION_DID,
  QR_CODE_DELEGATION_KEY,
  QR_CODE_DELEGATION_SIGNATURE,
  QR_CODE_SENDER_AGENCY,
  QR_CODE_SENDER_AGENCY_DID,
  QR_CODE_SENDER_AGENCY_KEY,
  QR_CODE_SENDER_AGENCY_ENDPOINT,
} from '../api/api-constants'
import {
  invitationRoute,
  qrCodeScannerTabRoute,
  homeTabRoute,
} from '../common/'
import type { QrCode } from '../components/qr-scanner/type-qr-scanner'
import type { Store } from '../store/type-store'
import type { InvitationPayload } from '../invitation/type-invitation'
import type {
  QRCodeScannerScreenState,
  QRCodeScannerScreenProps,
} from './type-qr-code'
import {
  MESSAGE_NO_CAMERA_PERMISSION,
  MESSAGE_ALLOW_CAMERA_PERMISSION,
} from './type-qr-code'

export function convertQrCodeToInvitation(qrCode: QrCode) {
  const qrSenderDetail = qrCode[QR_CODE_SENDER_DETAIL]
  const qrSenderAgency = qrCode[QR_CODE_SENDER_AGENCY]
  const senderDetail = {
    name: qrSenderDetail[QR_CODE_SENDER_NAME],
    agentKeyDlgProof: {
      agentDID:
        qrSenderDetail[QR_CODE_SENDER_KEY_DELEGATION][QR_CODE_DELEGATION_DID],
      agentDelegatedKey:
        qrSenderDetail[QR_CODE_SENDER_KEY_DELEGATION][QR_CODE_DELEGATION_KEY],
      signature:
        qrSenderDetail[QR_CODE_SENDER_KEY_DELEGATION][
          QR_CODE_DELEGATION_SIGNATURE
        ],
    },
    DID: qrSenderDetail[QR_CODE_SENDER_DID],
    logoUrl: qrSenderDetail[QR_CODE_LOGO_URL],
    verKey: qrSenderDetail[QR_CODE_SENDER_VERIFICATION_KEY],
  }

  const senderAgencyDetail = {
    DID: qrSenderAgency[QR_CODE_SENDER_AGENCY_DID],
    verKey: qrSenderAgency[QR_CODE_SENDER_AGENCY_KEY],
    endpoint: qrSenderAgency[QR_CODE_SENDER_AGENCY_ENDPOINT],
  }

  return {
    senderEndpoint: senderAgencyDetail.endpoint,
    requestId: qrCode[QR_CODE_REQUEST_ID],
    senderAgentKeyDelegationProof: senderDetail.agentKeyDlgProof,
    senderName: senderDetail.name,
    senderDID: senderDetail.DID,
    senderLogoUrl: senderDetail.logoUrl,
    senderVerificationKey: senderDetail.verKey,
    targetName: qrCode[QR_CODE_TARGET_NAME],
    senderDetail,
    senderAgencyDetail,
  }
}

export class QRCodeScannerScreen extends Component<
  QRCodeScannerScreenProps,
  QRCodeScannerScreenState
> {
  state = {
    isCameraAuthorized: false,
  }

  onRead = (qrCode: QrCode) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      const invitation = {
        payload: convertQrCodeToInvitation(qrCode),
      }
      this.props.invitationReceived(invitation)
      this.props.navigation.navigate(invitationRoute, {
        senderDID: invitation.payload.senderDID,
      })
    }
  }

  onClose = () => {
    this.props.navigation.navigate(homeTabRoute)
  }

  allowCameraPermissionAcknowledged = () => {
    this.props.navigation.goBack()
  }

  setHasCameraAccessPermission = () => {
    this.setState({ isCameraAuthorized: true })
  }

  setNoCameraAccessPermission = () => {
    Alert.alert(MESSAGE_NO_CAMERA_PERMISSION, MESSAGE_ALLOW_CAMERA_PERMISSION, [
      { text: 'OK', onPress: this.allowCameraPermissionAcknowledged },
    ])
    this.setState({ isCameraAuthorized: false })
  }

  checkCameraAuthorization = () => {
    Camera.checkVideoAuthorizationStatus()
      .then((authorization: boolean) => {
        if (authorization) {
          this.setHasCameraAccessPermission()
        } else {
          this.setNoCameraAccessPermission()
        }
      })
      .catch(this.setNoCameraAccessPermission)
  }

  componentWillReceiveProps(nextProps: QRCodeScannerScreenProps) {
    if (nextProps.currentScreen === qrCodeScannerTabRoute) {
      // whenever user navigates to this screen, we have to check permission
      // every time, although we should have this logic in componentDidMount
      // but in the router (react navigation) that we are using
      // it caches a component and does not unmount it, and hence
      // componentDidMount is not called every time user comes to this screen
      // so, the option we have now is to use one of other life cycle events
      // such as `cwrp` or `cdu`, we are `cwrp` to check the status every time
      // also, we check status only on the basis of screen switching
      // and only check status if user is redirecting to QrCodeScanScreen
      this.checkCameraAuthorization()
    }
  }

  shouldComponentUpdate(nextProps: QRCodeScannerScreenProps) {
    // due to the behavior of react navigation which caches the component
    // so, all connected props update will still propagate to this component
    // and we don't want to re-render camera and related stuff
    return nextProps.currentScreen === qrCodeScannerTabRoute
  }

  componentDidMount() {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      // when this component is mounted first time, `cwrp` will not be called
      // so for the first time mount as well we need to check camera permission
      this.checkCameraAuthorization()
    }
  }

  render() {
    return (
      <Container>
        {this.state.isCameraAuthorized && (
          <QRScanner onRead={this.onRead} onClose={this.onClose} />
        )}
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  currentScreen: state.route.currentScreen,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      invitationReceived,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScannerScreen)

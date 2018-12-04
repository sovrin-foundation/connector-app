// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Camera from 'react-native-camera'
import {
  Alert,
  Platform,
  PermissionsAndroid,
  StatusBar,
  AppState,
} from 'react-native'
import { Container, QRScanner } from '../components'
import { color, barStyleLight, barStyleDark } from '../common/styles/constant'
import { invitationReceived } from '../invitation/invitation-store'
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
  MESSAGE_RESET_CONNECT_ME,
  MESSAGE_RESET_DETAILS,
} from './type-qr-code'
import type { EnvironmentSwitchUrlQrCode } from '../components/qr-scanner/type-qr-scanner'
import { changeEnvironmentUrl } from '../store/config-store'
import { captureError } from '../services/error/error-handler'

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

export class QRCodeScannerScreen extends PureComponent<
  QRCodeScannerScreenProps,
  QRCodeScannerScreenState
> {
  state = {
    appState: AppState.currentState,
    isCameraAuthorized: false,
    isCameraEnabled: false,
  }

  permissionCheckIntervalId = 0
  checkPermission = false

  onRead = (qrCode: QrCode) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      const invitation = {
        payload: convertQrCodeToInvitation(qrCode),
      }
      this.props.invitationReceived(invitation)
      this.props.navigation.push(invitationRoute, {
        senderDID: invitation.payload.senderDID,
      })
    }
  }

  onAllowSwitchEnvironment = (url: EnvironmentSwitchUrlQrCode) => {
    this.props.changeEnvironmentUrl(url.url)
    this.props.navigation.navigate(homeTabRoute)
  }

  onEnvironmentSwitchUrl = (url: EnvironmentSwitchUrlQrCode) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      Alert.alert(MESSAGE_RESET_CONNECT_ME, MESSAGE_RESET_DETAILS(url.name), [
        { text: 'Cancel' },
        {
          text: 'Switch',
          onPress: () => this.onAllowSwitchEnvironment(url),
        },
      ])
    }
  }

  onInvitationUrl = (payload: InvitationPayload) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      this.props.invitationReceived({ payload })
      this.props.navigation.push(invitationRoute, {
        senderDID: payload.senderDID,
      })
    }
  }

  onClose = () => {
    this.props.navigation.navigate(homeTabRoute)
    this.setState({ isCameraEnabled: false })
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
    if (Platform.OS === 'ios') {
      Camera.checkVideoAuthorizationStatus()
        .then((authorization: boolean) => {
          if (authorization) {
            this.setHasCameraAccessPermission()
          } else {
            this.setNoCameraAccessPermission()
          }
        })
        .catch(this.setNoCameraAccessPermission)
    } else {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'App Camera Permission',
        message:
          'App needs access to your camera ' +
          'so you can scan QR codes and form connections.',
      })
        .then(result => {
          if (result === 'granted') {
            this.setHasCameraAccessPermission()
          } else {
            this.setNoCameraAccessPermission()
          }
        })
        .catch(this.setNoCameraAccessPermission)
    }
  }

  componentWillReceiveProps(nextProps: QRCodeScannerScreenProps) {
    if (
      nextProps.currentScreen !== this.props.currentScreen &&
      nextProps.currentScreen === qrCodeScannerTabRoute
    ) {
      // whenever user navigates to this screen, we have to check permission
      // every time, although we should have this logic in componentDidMount
      // but in the router (react navigation) that we are using
      // it caches a component and does not unmount it, and hence
      // componentDidMount is not called every time user comes to this screen
      // so, the option we have now is to use one of other life cycle events
      // such as `cwrp` or `cdu`, we are `cwrp` to check the status every time
      // also, we check status only on the basis of screen switching
      // and only check status if user is redirecting to QrCodeScanScreen
      if (nextProps.navigation.isFocused()) {
        this.setState({ isCameraEnabled: true })
      }

      if (Platform.OS === 'android') {
        this.permissionCheckIntervalId = setInterval(() => {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            .then(result => {
              if (result) {
                this.checkCameraAuthorization()
                clearInterval(this.permissionCheckIntervalId)
              } else {
                if (!this.checkPermission) {
                  this.checkCameraAuthorization()
                }
                this.checkPermission = true
              }
            })
            .catch(err => {
              captureError(err)
            })
        }, 1000)
      } else {
        this.checkCameraAuthorization()
      }
    } else {
      this.permissionCheckIntervalId &&
        clearInterval(this.permissionCheckIntervalId)
      this.checkPermission = false
    }
  }

  updateStatusBarTheme() {
    if (this.props.navigation.isFocused()) {
      StatusBar.setBarStyle(barStyleLight, true)
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(color.bg.sixth.color)
      }
    }
  }

  componentDidMount() {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      // when this component is mounted first time, `cwrp` will not be called
      // so for the first time mount as well we need to check camera permission
      this.checkCameraAuthorization()
      this.updateStatusBarTheme()
    }
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentDidUpdate() {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      this.updateStatusBarTheme()
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.setState({ isCameraEnabled: true })
    } else if (
      this.state.appState &&
      nextAppState.match(/inactive|background/) &&
      this.state.appState === 'active'
    ) {
      this.setState({ isCameraEnabled: false })
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    return (
      //Till the time camera authorization is checked
      //empty black screen will be returned
      //so that it doesn't look odd
      <Container dark collapsable={true}>
        {this.state.isCameraAuthorized &&
        this.state.isCameraEnabled &&
        this.props.currentScreen === qrCodeScannerTabRoute ? (
          <QRScanner
            onRead={this.onRead}
            onClose={this.onClose}
            onEnvironmentSwitchUrl={this.onEnvironmentSwitchUrl}
            onInvitationUrl={this.onInvitationUrl}
          />
        ) : null}
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
      changeEnvironmentUrl,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScannerScreen)

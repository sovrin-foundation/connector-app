// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, QRScanner } from '../components'
import { color, barStyleLight } from '../common/styles/constant'
import { qrConnectionRequestReceived } from '../store'
import {
  PENDING_CONNECTION_REQUEST_CODE,
  QR_CODE_SENDER_NAME,
  QR_CODE_TARGET_NAME,
  QR_CODE_LOGO_URL,
} from '../services/api'
import {
  qrConnectionRequestRoute,
  qrCodeScannerTabRoute,
  homeTabRoute,
} from '../common/'
import type { QrCode } from '../components/qr-scanner/type-qr-scanner'
import type { Store } from '../store/type-store'

export class QRCodeScannerScreen extends PureComponent {
  onRead = (qrCode: QrCode) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      const qrConnectionRequest = {
        payload: qrCode,
        title: `Hi ${qrCode[QR_CODE_TARGET_NAME]}`,
        message: `${qrCode[QR_CODE_SENDER_NAME]} wants to connect with you`,
        senderLogoUrl: qrCode[QR_CODE_LOGO_URL],
      }

      this.props.qrConnectionRequestReceived(qrConnectionRequest)
      this.props.navigation.navigate(qrConnectionRequestRoute)
    }
  }

  onClose = () => {
    this.props.navigation.navigate(homeTabRoute)
  }

  render() {
    return (
      <Container>
        <QRScanner onRead={this.onRead} onClose={this.onClose} />
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
      qrConnectionRequestReceived,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScannerScreen)

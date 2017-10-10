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
} from '../common/api-constants'
import {
  qrConnectionRequestRoute,
  qrCodeScannerTabRoute,
  homeTabRoute,
} from '../common/'
import type { QrConnectionPayload } from '../qr-connection-request/type-qr-connection-request'
import type { Store } from '../store/type-store'

export class QRCodeScannerScreen extends PureComponent {
  onRead = (data: QrConnectionPayload) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      const qrConnectionRequest = {
        payload: data,
        title: `Hi ${data.challenge[QR_CODE_TARGET_NAME]}`,
        message: `${data.challenge[
          QR_CODE_SENDER_NAME
        ]} wants to connect with you`,
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

// @flow
import React, { PureComponent } from 'react'
import { StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Footer, QRScanner } from '../components'
import { color, barStyleLight } from '../common/styles/constant'
import { qrConnectionRequestReceived } from '../store'
import {
  PENDING_CONNECTION_REQUEST_CODE,
  QR_CODE_ENTERPRISE_AGENT_NAME,
  QR_CODE_USER_NAME,
} from '../common/api-constants'
import { qrConnectionRequestRoute, qrCodeScannerRoute } from '../common/'
import type {
  QrConnectionPayload,
} from '../qr-connection-request/type-qr-connection-request'
import type { Store } from '../store/type-store'

export class QRCodeScannerScreen extends PureComponent {
  onRead = (data: QrConnectionPayload) => {
    if (this.props.currentScreen === qrCodeScannerRoute) {
      const qrConnectionRequest = {
        payload: data,
        title: `Hi ${data.challenge[QR_CODE_USER_NAME]}`,
        message: `${data.challenge[QR_CODE_ENTERPRISE_AGENT_NAME]} wants to connect with you`,
      }

      this.props.qrConnectionRequestReceived(qrConnectionRequest)
      this.props.navigation.navigate(qrConnectionRequestRoute)
    }
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle={barStyleLight} />
        <QRScanner onRead={this.onRead} />
        <Footer navigation={this.props.navigation} />
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

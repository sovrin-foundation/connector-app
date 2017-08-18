import React, { PureComponent } from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Footer, QRScanner } from '../components'
import { color, barStyleLight } from '../common/styles/constant'
import { qrConnectionRequestReceived } from '../store'
import {
  PENDING_CONNECTION_REQUEST_CODE,
  QR_CODE_ENTERPRISE_AGENT_NAME,
  QR_CODE_USER_NAME,
  QR_CODE_REMOTE_CONNECTION_LOGO,
} from '../common/api-constants'
import { invitationRoute } from '../common/route-constants'

export class QRCodeScannerScreen extends PureComponent {
  onRead = data => {
    const qrConnectionRequest = {
      payload: data,
      statusCode: PENDING_CONNECTION_REQUEST_CODE,
      offerMsgTitle: `Hi ${data.challenge[QR_CODE_USER_NAME]}`,
      offerMsgText: `${data.challenge[QR_CODE_ENTERPRISE_AGENT_NAME]} wants to connect with you`,
      logoUrl: data.challenge[QR_CODE_REMOTE_CONNECTION_LOGO],
    }

    this.props.qrConnectionRequestReceived(qrConnectionRequest)
    // user will be automatically navigated from here to invitations screen
    // because splash-screen.js checks for any changes in invitation data
    // and if invitation is available, user is redirected to invitation page
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      qrConnectionRequestReceived,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(QRCodeScannerScreen)

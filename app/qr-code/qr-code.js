// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, QRScanner } from '../components'
import { color, barStyleLight } from '../common/styles/constant'
import { invitationReceived } from '../store'
import {
  PENDING_CONNECTION_REQUEST_CODE,
  QR_CODE_SENDER_NAME,
  QR_CODE_TARGET_NAME,
  QR_CODE_LOGO_URL,
  QR_CODE_SENDER_ENDPOINT,
  QR_CODE_REQUEST_ID,
  QR_CODE_AGENT_PROOF,
  QR_CODE_SENDER_DID,
  QR_CODE_SENDER_VERIFICATION_KEY,
} from '../services/api'
import {
  invitationRoute,
  qrCodeScannerTabRoute,
  homeTabRoute,
} from '../common/'
import type { QrCode } from '../components/qr-scanner/type-qr-scanner'
import type { Store } from '../store/type-store'
import type { InvitationPayload } from '../invitation/type-invitation'

export function convertQrCodeToInvitation(qrCode: QrCode) {
  return {
    senderEndpoint: qrCode[QR_CODE_SENDER_ENDPOINT],
    requestId: qrCode[QR_CODE_REQUEST_ID],
    senderAgentKeyDelegationProof: qrCode[QR_CODE_AGENT_PROOF],
    senderName: qrCode[QR_CODE_SENDER_NAME],
    senderDID: qrCode[QR_CODE_SENDER_DID],
    senderLogoUrl: qrCode[QR_CODE_LOGO_URL],
    senderVerificationKey: qrCode[QR_CODE_SENDER_VERIFICATION_KEY],
    targetName: qrCode[QR_CODE_TARGET_NAME],
  }
}

export class QRCodeScannerScreen extends PureComponent {
  onRead = (qrCode: QrCode) => {
    if (this.props.currentScreen === qrCodeScannerTabRoute) {
      const invitation = {
        payload: convertQrCodeToInvitation(qrCode),
      }
      this.props.invitationReceived(invitation)
      this.props.navigation.navigate(invitationRoute, {
        senderDID: qrCode[QR_CODE_SENDER_DID],
      })
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
      invitationReceived,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScannerScreen)

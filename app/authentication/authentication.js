// @flow
import React, { PureComponent } from 'react'
import { View, Text, Image, AlertIOS } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { encode } from 'bs58'

import { getKeyPairFromSeed, getSignature, captureError } from '../services'
import FCM from 'react-native-fcm'
import {
  connectionRoute,
  homeRoute,
  TOUCH_ID_MESSAGE,
  PUSH_NOTIFICATION_PERMISSION_ERROR,
  ALLOW,
  DENY,
} from '../common'
import {
  resetAuthenticationStatus,
  sendUserAuthenticationResponse,
  getConnection,
} from '../store'
import type { Store } from '../store/type-store'
import { Container, Request } from '../components'
import ConnectionSuccessModal from './connection-success-modal'

class Authentication extends PureComponent {
  state = {
    isModalVisible: false,
  }

  _showConnectionSuccessModal = (isModalVisible, route) => {
    this.setState({ isModalVisible })
    if (route) {
      this.props.navigation.navigate(route)
    }
  }
  onUserResponse = (newStatus: string) => {
    let {
      type: authenticationType,
      data: { remoteConnectionId },
    } = this.props.authentication

    const { connections: { data: connectionsData } } = this.props
    const connection = getConnection(remoteConnectionId, connectionsData)
    let { identifier, seed } = connection[0]
    let { secretKey: signingKey } = getKeyPairFromSeed(seed)

    const challenge = JSON.stringify({
      newStatus,
    })
    const signature = encode(getSignature(signingKey, challenge))
    this.props.sendUserAuthenticationResponse(
      {
        newStatus,
        identifier,
        dataBody: {
          challenge,
          signature,
        },
      },
      this.props.config,
      authenticationType
    )
  }

  render() {
    //TODO once authentication result is sent successfully,
    // authentication.data will be reset to null which will break bellow statement when re-rendered.
    const {
      data: { offerMsgTitle, offerMsgText, logoUrl, name },
    } = this.props.authentication
    return (
      <Container>
        <Request
          title={offerMsgTitle}
          message={offerMsgText}
          senderLogoUrl={logoUrl}
          onAction={this.onUserResponse}
        />
        <ConnectionSuccessModal
          isModalVisible={this.state.isModalVisible}
          showConnectionSuccessModal={this._showConnectionSuccessModal}
          name={name}
          logoUrl={logoUrl}
        />
      </Container>
    )
  }
}

const mapStateToProps = ({ authentication, connections, config }: Store) => ({
  authentication,
  connections,
  config,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetAuthenticationStatus,
      sendUserAuthenticationResponse,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Authentication)

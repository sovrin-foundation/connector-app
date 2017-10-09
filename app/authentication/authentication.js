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
import { AUTHENTICATION_STATUS } from './authentication-store'

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
  componentWillReceiveProps(nextProps) {
    if (nextProps.authentication.status != this.props.authentication.status) {
      if (
        !nextProps.authentication.isFetching &&
        nextProps.authentication.status === AUTHENTICATION_STATUS.ACCEPTED &&
        !nextProps.authentication.error
      ) {
        this.props.navigation.navigate(connectionRoute)
        this.props.resetAuthenticationStatus()
      } else if (
        !nextProps.authentication.isFetching &&
        (nextProps.authentication.status === AUTHENTICATION_STATUS.REJECTED ||
          nextProps.authentication.error)
      ) {
        this.props.navigation.navigate(homeRoute)
        this.props.resetAuthenticationStatus()
      }
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
    const { data } = this.props.authentication
    let offerMsgTitle = '',
      offerMsgText = '',
      logoUrl = null,
      name
    if (data) {
      offerMsgTitle = data.offerMsgTitle
      offerMsgText = data.offerMsgText
      logoUrl = data.logoUrl
    }
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

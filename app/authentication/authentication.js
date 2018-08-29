// @flow
import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { connectionRoute, homeRoute } from '../common'
import { getConnection } from '../store/connections-store'
import type { Store } from '../store/type-store'
import { Container, Request } from '../components'
import ConnectionSuccessModal from './connection-success-modal'
import {
  AUTHENTICATION_STATUS,
  resetAuthenticationStatus,
  sendUserAuthenticationResponse,
} from './authentication-store'
import type { Connection } from '../store/type-connection-store'

// TODO:KS Fix type for this screen, we are not using this screen
// as of now, so we will fix this later
class Authentication extends PureComponent<any, any> {
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
    // $FlowFixMe
    const connection: Connection[] = getConnection(
      remoteConnectionId,
      connectionsData
    )
    let { identifier } = connection[0]

    const challenge = JSON.stringify({
      newStatus,
    })

    this.props.sendUserAuthenticationResponse(
      {
        newStatus,
        identifier,
        remoteConnectionId,
        dataBody: {
          challenge,
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
      name = ''

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
          navigation={this.props.navigation}
          showErrorAlerts={this.props.config.showErrorAlerts}
          testID="authentication-request"
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

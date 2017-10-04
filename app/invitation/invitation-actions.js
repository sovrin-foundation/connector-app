import React, { PureComponent } from 'react'
import { View, AlertIOS } from 'react-native'
import FCM from 'react-native-fcm'
import TouchId from 'react-native-touch-id'
import { connect } from 'react-redux'
import { StyledButton } from '../styled-components/common-styled'
import {
  Container,
  CustomButton,
  ImageColorPicker,
  ConnectionTheme,
} from '../components'
import { encode } from 'bs58'

import { getKeyPairFromSeed, getSignature, captureError } from '../services'
import {
  connectionRoute,
  homeRoute,
  TOUCH_ID_MESSAGE,
  PUSH_NOTIFICATION_PERMISSION_ERROR,
  ALLOW,
  DENY,
} from '../common'
import { INVITATION_STATUS, getConnection } from '../store'
import ConnectionSuccessModal from './connection-success-modal'

export default class actions extends PureComponent {
  state = {
    isModalVisible: false,
  }

  onUserResponse = newStatus => {
    // get Push Notification permission, for iOS
    FCM.requestPermissions()
      .then(res => {
        const requiredProvisioningData = []

        if (this.props.tapCount < 4) {
          // add touchId authentication
          requiredProvisioningData.push(TouchId.authenticate(TOUCH_ID_MESSAGE))
        }

        Promise.all(requiredProvisioningData)
          .then(() => {
            // reset avatar tapCount
            this.props.resetTapCount()

            let {
              type: invitationType,
              data: { remoteConnectionId },
            } = this.props.invitation

            const { connections: { data: connectionsData } } = this.props
            const connection = getConnection(
              remoteConnectionId,
              connectionsData
            )
            let { identifier, seed } = connection[0]
            let { secretKey: signingKey } = getKeyPairFromSeed(seed)

            const challenge = JSON.stringify({
              newStatus,
            })
            const signature = encode(getSignature(signingKey, challenge))
            this.props.sendUserInvitationResponse(
              {
                newStatus,
                identifier,
                dataBody: {
                  challenge,
                  signature,
                },
              },
              this.props.config,
              invitationType
            )
          })
          .catch(e => {
            captureError(e)
          })
      })
      .catch(e => {
        captureError(e)
        AlertIOS.alert(...PUSH_NOTIFICATION_PERMISSION_ERROR)
      })
  }

  _showConnectionSuccessModal = (isModalVisible, route) => {
    this.setState({ isModalVisible })
    if (route) {
      this.props.navigation.navigate(route)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.status != this.props.invitation.status) {
      if (
        !nextProps.invitation.isFetching &&
        nextProps.invitation.status === INVITATION_STATUS.ACCEPTED &&
        !nextProps.invitation.error
      ) {
        this.props.navigation.navigate(connectionRoute)
        this.props.resetInvitationStatus()
      } else if (
        !nextProps.invitation.isFetching &&
        (nextProps.invitation.status === INVITATION_STATUS.REJECTED ||
          nextProps.invitation.error)
      ) {
        this.props.navigation.navigate(homeRoute)
        this.props.resetInvitationStatus()
      }
    }
  }

  render() {
    //TODO: get connection-name and connection-logoUrl from back-end
    const data = this.props.invitation.data
    let name, logoUrl
    if (data) {
      name = data.name
      logoUrl = data.logoUrl
    }

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Container>
            <ConnectionTheme shade="0.5">
              <CustomButton
                secondary
                raised
                title={DENY}
                onPress={() => this.onUserResponse(INVITATION_STATUS.REJECTED)}
              />
            </ConnectionTheme>

          </Container>
          <Container>
            <ConnectionTheme>
              <CustomButton
                raised
                title={ALLOW}
                onPress={() => this.onUserResponse(INVITATION_STATUS.ACCEPTED)}
              />
            </ConnectionTheme>
          </Container>
          <ConnectionSuccessModal
            isModalVisible={this.state.isModalVisible}
            showConnectionSuccessModal={this._showConnectionSuccessModal}
            name={name}
            logoUrl={logoUrl}
          />
        </View>
        <ImageColorPicker imageUrl={logoUrl} />
      </View>
    )
  }
}

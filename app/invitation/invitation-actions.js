import React, { PureComponent } from 'react'
import { View, AlertIOS } from 'react-native'
import FCM from 'react-native-fcm'
import TouchId from 'react-native-touch-id'
import { connect } from 'react-redux'
import { StyledButton } from '../styled-components/common-styled'
import { Container, CustomButton } from '../components'
import { encode } from 'bs58'

import {
  getKeyPairFromSeed,
  getSignature,
  verifySignature,
  randomSeed,
} from '../services'
import {
  connectionRoute,
  homeRoute,
  TOUCH_ID_MESSAGE,
  DEVICE_ENROLLMENT_ERROR,
  PUSH_NOTIFICATION_PERMISSION_ERROR,
  ALLOW,
  DENY,
  QR_CODE_CHALLENGE,
  QR_CODE_REMOTE_CONNECTION_ID,
  DUPLICATE_CONNECTION_ERROR,
} from '../common'
import { INVITATION_TYPE, INVITATION_STATUS, getConnection } from '../store'
import ConnectionSuccessModal from './connection-success-modal'

export default class actions extends PureComponent {
  state = {
    isModalVisible: false,
  }

  componentWillMount() {
    this.isDuplicateInvitation()
  }

  okayAction = () => {
    this.props.resetInvitationStatus()
    this.props.navigation.navigate(homeRoute)
  }

  isDuplicateInvitation = () => {
    const { type: invitationType } = this.props.invitation
    if (
      invitationType === INVITATION_TYPE.PENDING_CONNECTION_REQUEST ||
      invitationType === INVITATION_TYPE.QR_CONNECTION_REQUEST
    ) {
      const remoteConnectionId = invitationType ===
        INVITATION_TYPE.PENDING_CONNECTION_REQUEST
        ? this.props.invitation.data.remoteConnectionId
        : this.props.invitation.data.payload.challenge[
            QR_CODE_REMOTE_CONNECTION_ID
          ]

      const connection = getConnection(
        remoteConnectionId,
        this.props.connections.data
      )
      if (connection.length > 0) {
        AlertIOS.alert(...DUPLICATE_CONNECTION_ERROR, [
          {
            onPress: () => this.okayAction(),
          },
        ])
      }
    }
  }

  onUserResponse = newStatus => {
    this.isDuplicateInvitation()

    // get Push Notification permission, for iOS
    FCM.requestPermissions()
      .then(res => {
        const requiredProvisioningData = []

        if (this.props.tapCount < 4) {
          // add touchId authentication
          requiredProvisioningData.push(TouchId.authenticate(TOUCH_ID_MESSAGE))
        }

        // device enrollment
        Promise.all(requiredProvisioningData).then(() => {
          const phoneNumber = (Math.random() * 1000000000000000000)
            .toString()
            .substring(0, 10)
          let identifier = randomSeed(32).substring(0, 22)
          let seed = randomSeed(32).substring(0, 32)
          const { pushToken } = this.props.pushNotification

          this.setState({ identifier })

          if (identifier && seed && pushToken) {
            // reset avatar tapCount
            this.props.resetTapCount()
            let {
              publicKey: verKey,
              secretKey: signingKey,
            } = getKeyPairFromSeed(seed)
            verKey = encode(verKey)

            let {
              type: invitationType,
              data: { remoteConnectionId },
            } = this.props.invitation

            if (invitationType === INVITATION_TYPE.PENDING_CONNECTION_REQUEST) {
              const challenge = JSON.stringify({
                newStatus,
                identifier,
                verKey,
                pushComMethod: `FCM:${pushToken}`,
              })
              const signature = encode(getSignature(signingKey, challenge))

              const connectionChallenge = JSON.stringify({
                remoteConnectionId,
              })
              const connectionChallengeSignature = encode(
                getSignature(signingKey, connectionChallenge)
              )

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
                invitationType,
                this.props.deepLink.token,
                {
                  identifier,
                  connectionBody: {
                    connectionChallenge,
                    connectionChallengeSignature,
                  },
                  remoteConnectionId,
                  seed,
                }
              )
            } else if (
              invitationType === INVITATION_TYPE.AUTHENTICATION_REQUEST
            ) {
              const { connections: { data: connectionsData } } = this.props
              const connection = getConnection(
                remoteConnectionId,
                connectionsData
              )
              console.log(connection[0])
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
            } else if (
              invitationType === INVITATION_TYPE.QR_CONNECTION_REQUEST
            ) {
              const {
                challenge: qrChallenge,
                qrData,
                signature: qrSignature,
              } = this.props.invitation.data.payload
              const apiData = {
                remoteChallenge: qrData[QR_CODE_CHALLENGE],
                remoteSig: qrSignature,
                newStatus,
                identifier,
                verKey,
                pushComMethod: `FCM:${pushToken}`,
              }

              const challenge = JSON.stringify(apiData)
              const signature = encode(getSignature(signingKey, challenge))
              remoteConnectionId = qrChallenge[QR_CODE_REMOTE_CONNECTION_ID]
              const connectionChallenge = JSON.stringify({
                remoteConnectionId,
              })
              const connectionChallengeSignature = encode(
                getSignature(signingKey, connectionChallenge)
              )

              this.props.sendUserInvitationResponse(
                { challenge, signature, ...apiData },
                this.props.config,
                invitationType,
                null,
                {
                  identifier,
                  connectionBody: {
                    connectionChallenge,
                    connectionChallengeSignature,
                  },
                  remoteConnectionId,
                  seed,
                }
              )
            }
          } else {
            AlertIOS.alert(...DEVICE_ENROLLMENT_ERROR)
          }
        })
      })
      .catch(e => {
        console.debug(e)
        AlertIOS.alert(...PUSH_NOTIFICATION_PERMISSION_ERROR)
      })
  }

  _showConnectionSuccessModal = (isModalVisible, route) => {
    this.setState({ isModalVisible })
    if (route) {
      this.props.navigation.navigate(route)
    }
  }

  clearInvitation = () => {
    setTimeout(this.props.resetInvitationStatus, 3000)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.status != this.props.invitation.status) {
      if (
        !nextProps.invitation.isFetching &&
        nextProps.invitation.status === INVITATION_STATUS.ACCEPTED &&
        !nextProps.invitation.error
      ) {
        const { type: invitationType } = nextProps.invitation
        if (
          invitationType === INVITATION_TYPE.PENDING_CONNECTION_REQUEST ||
          invitationType === INVITATION_TYPE.QR_CONNECTION_REQUEST
        ) {
          this._showConnectionSuccessModal(true)
        } else {
          this.props.navigation.navigate(connectionRoute)
        }
        this.clearInvitation()
      } else if (
        !nextProps.invitation.isFetching &&
        (nextProps.invitation.status === INVITATION_STATUS.REJECTED ||
          nextProps.invitation.error)
      ) {
        this.props.navigation.navigate(homeRoute)
        this.clearInvitation()
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
      <View style={{ flexDirection: 'row' }}>
        <Container>
          <CustomButton
            secondary
            raised
            title={DENY}
            onPress={() => this.onUserResponse(INVITATION_STATUS.REJECTED)}
          />
        </Container>
        <Container>
          <CustomButton
            primary
            raised
            title={ALLOW}
            onPress={() => this.onUserResponse(INVITATION_STATUS.ACCEPTED)}
          />
        </Container>
        <ConnectionSuccessModal
          isModalVisible={this.state.isModalVisible}
          showConnectionSuccessModal={this._showConnectionSuccessModal}
          name={name}
          logoUrl={logoUrl}
        />
      </View>
    )
  }
}

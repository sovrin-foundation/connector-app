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
} from '../services/keys'
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
} from '../common'
import { INVITATION_TYPE, INVITATION_STATUS } from '../store'

export default class actions extends PureComponent {
  onUserResponse = newStatus => {
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
          const identifier = randomSeed(32).substring(0, 22)
          const seed = randomSeed(32).substring(0, 32)
          const { pushToken } = this.props.pushNotification
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
                }
              )
            } else if (
              invitationType === INVITATION_TYPE.AUTHENTICATION_REQUEST
            ) {
              //TODO:PS: need to fix identifier
              //before marking multiple connections feature complete
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
              const apiData = {
                remoteChallenge: this.props.invitation.data.payload.qrData[
                  QR_CODE_CHALLENGE
                ],
                remoteSig: this.props.invitation.data.payload.signature,
                newStatus,
                identifier,
                verKey,
                pushComMethod: `FCM:${pushToken}`,
              }
              const challenge = JSON.stringify(apiData)
              const signature = encode(getSignature(signingKey, challenge))

              remoteConnectionId = this.props.invitation.data.payload.challenge[
                QR_CODE_REMOTE_CONNECTION_ID
              ]
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
        this.props.navigation.navigate(connectionRoute)
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
      </View>
    )
  }
}

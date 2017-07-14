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
} from '../services/keys'
import {
  PUSH_COM_METHOD,
  SEED,
  IDENTIFIER,
} from '../common/secure-storage-constants'
import { getItem } from '../services/secure-storage'
import { connectionRoute, homeRoute } from '../common/route-constants'
import {
  TOUCH_ID_MESSAGE,
  DEVICE_ENROLLMENT_ERROR,
  PUSH_NOTIFICATION_PERMISSION_ERROR,
} from '../common/message-constants'
import { ALLOW, DENY } from '../common/button-constants'
import { INVITATION_TYPE, INVITATION_STATUS } from '../store'

export default class actions extends PureComponent {
  constructor(props) {
    super(props)
  }

  onUserResponse = newStatus => {
    // get Push Notification permission, for iOS
    FCM.requestPermissions()
      .then(res => {
        const requiredProvisioningData = [
          getItem(IDENTIFIER),
          getItem(SEED),
          getItem(PUSH_COM_METHOD),
        ]

        if (this.props.tapCount < 4) {
          // add touchId authentication
          requiredProvisioningData.push(TouchId.authenticate(TOUCH_ID_MESSAGE))
        }

        // device enrollment
        Promise.all(
          requiredProvisioningData
        ).then(([identifier, seed, pushComMethod]) => {
          if (identifier && seed && pushComMethod) {
            // reset avatar tapCount
            this.props.resetTapCount()
            let {
              publicKey: verKey,
              secretKey: signingKey,
            } = getKeyPairFromSeed(seed)
            verKey = encode(verKey)

            const { type: invitationType } = this.props.invitation
            if (invitationType === INVITATION_TYPE.PENDING_CONNECTION_REQUEST) {
              const challenge = JSON.stringify({
                newStatus,
                identifier,
                verKey,
                pushComMethod: `FCM:${pushComMethod}`,
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
                invitationType,
                this.props.deepLink.token
              )
            } else if (
              invitationType == INVITATION_TYPE.AUTHENTICATION_REQUEST
            ) {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.status != this.props.invitation.status) {
      if (nextProps.invitation.status === INVITATION_STATUS.ACCEPTED) {
        this.props.navigation.navigate(connectionRoute)
        this.props.resetInvitationStatus()
      } else if (nextProps.invitation.status === INVITATION_STATUS.REJECTED) {
        this.props.navigation.navigate(homeRoute)
        this.props.resetInvitationStatus()
      }
    }
  }

  render() {
    const { type: invitationType } = this.props.invitation
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

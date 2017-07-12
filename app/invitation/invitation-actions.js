import React, { PureComponent } from 'react'
import { View } from 'react-native'
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
import { INVITATION_TYPE } from '../store'

export default class actions extends PureComponent {
  constructor(props) {
    super(props)
  }

  onUserResponse = newStatus => {
    const requiredProvisioningData = [
      getItem(IDENTIFIER),
      getItem(SEED),
      getItem(PUSH_COM_METHOD),
    ]

    if (this.props.tapCount < 4) {
      // add touchId authentication
      requiredProvisioningData.push(
        TouchId.authenticate('Please confirm with TouchID')
      )
    }

    Promise.all(
      requiredProvisioningData
    ).then(([identifier, seed, pushComMethod]) => {
      if (identifier && seed && pushComMethod) {
        // reset avatar tapCount
        this.props.resetTapCount()
        let { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
          seed
        )
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
        } else if (invitationType == INVITATION_TYPE.AUTHENTICATION_REQUEST) {
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
        console.error('Either Identifier or seed not present!')
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.status != this.props.invitation.status) {
      if (nextProps.invitation.status === 'accepted') {
        this.props.navigation.navigate(connectionRoute)
        this.props.resetInvitationStatus()
      } else if (nextProps.invitation.status === 'rejected') {
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
            title="Deny"
            onPress={() => this.onUserResponse('rejected')}
          />
        </Container>
        <Container>
          <CustomButton
            primary
            raised
            title="Allow"
            onPress={() => this.onUserResponse('accepted')}
          />
        </Container>
      </View>
    )
  }
}

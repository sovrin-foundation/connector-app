import React, { PureComponent } from 'react'
import { View, AsyncStorage, Button } from 'react-native'
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
import { connectionDetailRoute, homeRoute } from '../common/route-constants'

export default class actions extends PureComponent {
  constructor(props) {
    super(props)
  }

  onUserResponse = (newStatus, type) => {
    Promise.all([
      TouchId.authenticate('Please confirm with TouchID'),
      getItem(IDENTIFIER),
      getItem(SEED),
      getItem(PUSH_COM_METHOD),
    ]).then(([touchIdSuccess, identifier, seed, pushComMethod]) => {
      if (touchIdSuccess && identifier && seed && pushComMethod) {
        let { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
          seed
        )
        verKey = encode(verKey)

        if (type === 'PENDING_CONNECTION_REQUEST') {
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
            type,
            this.props.deepLink.token
          )
        } else if (type == 'AUTHENTICATION_REQUEST') {
          const challenge = JSON.stringify({
            newStatus,
          })
          const signature = encode(getSignature(signingKey, challenge))
          this.props.sendUserInvitationResponse(
            {
              identifier,
              newStatus,
              dataBody: {
                challenge,
                signature,
              },
            },
            this.props.config,
            type
          )
        }
      } else {
        console.error('Either Identifier or seed not present!')
      }
    })
  }

  async saveKey(value) {
    try {
      await AsyncStorage.setItem('newCurrentRoute', value)
    } catch (error) {
      console.log('Error saving newCurrentRoute' + error)
    }
  }

  async getKey(key) {
    try {
      const value = await AsyncStorage.getItem(key)
      return value
    } catch (error) {
      console.log('Error retrieving newCurrentRoute' + error)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.status != this.props.invitation.status) {
      if (nextProps.invitation.status === 'accepted') {
        this.saveKey(connectionDetailRoute)
        this.props.navigation.navigate(connectionDetailRoute)
        this.props.resetInvitationStatus()
      } else if (nextProps.invitation.status === 'rejected') {
        this.saveKey(homeRoute)
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
            onPress={() => this.onUserResponse('rejected', invitationType)}
          />
        </Container>
        <Container>
          <CustomButton
            primary
            raised
            title="Allow"
            onPress={() => this.onUserResponse('accepted', invitationType)}
          />
        </Container>
      </View>
    )
  }
}

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
import { getItem } from '../services/secure-storage'
import { connectionDetailRoute, homeRoute } from '../common/route-constants'
import { sendUserInvitationResponse } from './invitation-store'

class actions extends PureComponent {
  constructor(props) {
    super(props)
  }

  _onAllow = () => {
    if (this.props.invitation.type === 'PENDING_CONNECTION_REQUEST') {
      this.pendingConnectionRequest('ACCEPTED', 'PENDING_CONNECTION_REQUEST')
    } else if (this.props.invitation.type == 'AUTHENTICATION_REQUEST') {
      this.pendingConnectionRequest('ACCEPTED', 'AUTHNTICATION_REQUEST')
    }
  }

  _onDeny = () => {
    if (this.props.invitation.type === 'PENDING_CONNECTION_REQUEST') {
      this.pendingConnectionRequest('REJECTED', 'PENDING_CONNECTION_REQUEST')
    } else if (this.props.invitation.type == 'AUTHENTICATION_REQUEST') {
      this.pendingConnectionRequest('REJECTED', 'AUTHNTICATION_REQUEST')
    }
  }

  pendingConnectionRequest = (newStatus, type) => {
    Promise.all([
      TouchId.authenticate('Please confirm with TouchID'),
      getItem('identifier'),
      getItem('seed'),
    ]).then(([touchIdSuccess, identifier, seed]) => {
      if (touchIdSuccess && identifier && seed) {
        const { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
          seed
        )

        if (type === 'PENDING_CONNECTION_REQUEST') {
          const challenge = JSON.stringify({
            newStatus,
            identifier,
            verKey,
            pushComMethod: 'FCM',
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
            this.props.config
          )
        } else if (type == 'AUTHENTICATION_REQUEST') {
          const message = JSON.stringify({
            type: 'authRequestAnswered',
            newStatus,
          })
          const signature = encode(getSignature(signingKey, message))
          this.props.sendUserInvitationResponse(
            {
              identifier,
              newStatus,
              dataBody: {
                message,
                signature,
              },
            },
            this.porps.config
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

  connectionActionRequest(status) {
    if (status === 'ACCEPTED') {
      this.saveKey(connectionDetailRoute)
      this.props.navigation.navigate(connectionDetailRoute)
    } else if (status === 'REJECTED') {
      this.saveKey(homeRoute)
      this.props.navigation.navigate(homeRoute)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.invitation.status === 'ACCEPTED' ||
      nextProps.invitation.status === 'REJECTED'
    ) {
      const newStatus = nextProps.invitation.status
      this.connectionActionRequest(newStatus)
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Container>
          <CustomButton secondary raised title="Deny" onPress={this._onDeny} />
        </Container>
        <Container>
          <CustomButton primary raised title="Allow" onPress={this._onAllow} />
        </Container>
      </View>
    )
  }
}

const mapStateToProps = ({ invitation, config }) => ({
  invitation,
  config,
})

const mapDispatchToProps = dispatch => ({
  sendUserInvitationResponse: (data, config) =>
    dispatch(sendUserInvitationResponse(data, config)),
})

export default connect(mapStateToProps, mapDispatchToProps)(actions)

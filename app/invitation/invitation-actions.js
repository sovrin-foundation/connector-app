import React, { PureComponent } from 'react'
import { View, AsyncStorage, Button } from 'react-native'
import TouchId from 'react-native-touch-id'
import { connect } from 'react-redux'
import { StyledButton } from '../styled-components/common-styled'
import { Container, CustomButton } from '../components'
import bs58 from 'bs58'

import {
  getKeyPairFromSeed,
  getSignature,
  verifySignature,
} from '../services/keys'
import { getItem } from '../services/secure-storage'
import { authRequest } from './invitation-store'
import { connectionDetailRoute, homeRoute } from '../common/route-constants'

class actions extends PureComponent {
  constructor(props) {
    super(props)
  }

  _onAllow = () => {
    this.AuthRequest('ACCEPTED')
  }

  _onDeny = () => {
    this.AuthRequest('REJECTED')
  }

  AuthRequest = newStatus => {
    Promise.all([
      TouchId.authenticate('Please confirm with TouchID'),
      getItem('identifier'),
      getItem('seed'),
    ]).then(
      ([touchIdSuccess, identifier, seed]) => {
        if (touchIdSuccess && identifier && seed) {
          const msg = JSON.stringify({
            type: 'authReqAnswered',
            newStatus,
          })

          const {
            publicKey: verKey,
            secretKey: signingKey,
          } = getKeyPairFromSeed(seed)

          const signature = bs58.encode(getSignature(signingKey, msg))

          this.props.authRequest(
            {
              identifier,
              newStatus,
              dataBody: {
                msg,
                signature,
              },
            },
            this.props.config
          )
        } else {
          console.error('Either Identifier or seed not present!')
        }
      },
      error => {
        console.log(error)
      }
    )
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

  authRequestSuccess(newStatus) {
    if (newStatus === 'ACCEPTED') {
      this.saveKey(connectionDetailRoute)
      this.props.navigation.navigate(connectionDetailRoute)
    } else if (newStatus === 'REJECTED') {
      this.saveKey(homeRoute)
      this.props.navigation.navigate(homeRoute)
    }
  }

  render() {
    const { authRes } = this.props.invitation
    if (authRes && authRes.data && authRes.data.status == 200) {
      this.authRequestSuccess(authRes.newStatus)
    }
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
  authRequest: (reqData, config) => dispatch(authRequest(reqData, config)),
})

export default connect(mapStateToProps, mapDispatchToProps)(actions)

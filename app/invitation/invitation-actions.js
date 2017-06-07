import React, { PureComponent } from 'react'
import { View, StyleSheet, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import TouchId from 'react-native-touch-id'
import { connect } from 'react-redux'

import {
  getKeyPairFromSeed,
  getSignature,
  verifySignature,
} from '../services/keys'
import { getItem } from '../services/secure-storage'
import bs58 from 'bs58'
import { authRequest } from './invitation-store'
import { isContainsDefined } from '../services/utils'

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
      values => {
        const identifier = values[1], seed = values[2]
        if (isContainsDefined(values)) {
          const msg = JSON.stringify({
            type: 'authReqAnswered',
            newStatus,
          })

          const {
            publicKey: verKey,
            secretKey: signingKey,
          } = getKeyPairFromSeed('5ZF5PicKgh4rZsBsGQBprZ5ZF5PicKgh')

          const signature = bs58.encode(getSignature(signingKey, msg))

          this.props.authRequest({
            identifier: '5ZF5PicKgh4rZsBsGQBprZ5ZF5PicKgh',
            dataBody: {
              msg,
              signature,
            },
          })

          this.props.invitation.invitationApiData
            .then(res => {
              if (res.status == 200) {
                if (newStatus === 'ACCEPTED') {
                  this.saveKey('CallCenter')
                  this.props.navigation.navigate('CallCenter')
                } else if (newStatus === 'REJECTED') {
                  this.saveKey('Home')
                  this.props.navigation.navigate('Home')
                }
              } else {
                throw new Error('Bad Request')
              }
            })
            .catch(error => console.log(error))
        } else {
          console.error('either Identifier or seed not present!')
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

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Button
            buttonStyle={buttonStyles.invitaitonActions}
            title="Deny"
            raised
            icon={{ name: 'clear' }}
            onPress={this._onDeny}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            buttonStyle={buttonStyles.invitaitonActions}
            title="Allow"
            raised
            icon={{ name: 'check' }}
            backgroundColor="#43a047"
            onPress={this._onAllow}
          />
        </View>
      </View>
    )
  }
}

const buttonStyles = StyleSheet.create({
  invitaitonActions: {
    marginRight: 0,
    marginLeft: 0,
  },
})

const mapStateToProps = ({ invitation }) => ({
  invitation,
})

const mapDispatchToProps = dispatch => ({
  authRequest: reqData => dispatch(authRequest(reqData)),
})

export default connect(mapStateToProps, mapDispatchToProps)(actions)

import React, { PureComponent } from 'react'
import { setItem, getItem } from '../services/secure-storage'
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import bs58 from 'bs58'
import {
  PUSH_COM_METHOD,
  SEED,
  IDENTIFIER,
  PHONE,
} from '../common/secure-storage-constants'

export default class UserEnroll extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    Promise.all([getItem('identifier'), getItem('phone'), getItem('seed')])
      .then(([identifier, phoneNumber, seed]) => {
        if (!identifier || !phoneNumber || !seed) {
          phoneNumber = (Math.random() * 1000000000000000000)
            .toString()
            .substring(0, 10)
          identifier = randomSeed(32).substring(0, 22)
          seed = randomSeed(32).substring(0, 32)
          let { publicKey: verKey } = getKeyPairFromSeed(seed)
          verKey = bs58.encode(verKey)
          setItem(SEED, seed)
          this.enrollUser(phoneNumber, identifier, verKey)
        }
      })
      .catch(error => {
        console.log(
          'LOG: error getItem for identifier, phone and seed failed, ',
          error
        )
      })
  }

  enrollUser(phoneNumber, id, verKey) {
    getItem(PUSH_COM_METHOD)
      .then(pushComMethod => {
        if (pushComMethod) {
          // TODO:KS Add signature
          this.props.enrollAction({
            phoneNumber,
            id,
            verKey,
            pushComMethod,
          })
        } else {
          console.log('LOG: error Device PushComMethod not present')
        }
      })
      .catch(function(error) {
        console.log('LOG: error setItem token, ', error)
      })
  }

  render() {
    return null
  }
}

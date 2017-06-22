import React, { PureComponent } from 'react'
import { setItem, getItem, deleteItem } from '../services/secure-storage'
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import bs58 from 'bs58'
import {
  PUSH_COM_METHOD,
  SEED,
  IDENTIFIER,
  PHONE,
} from '../common/secure-storage-constants'

const getVerificationKey = seed =>
  bs58.encode(getKeyPairFromSeed(seed).publicKey)

export default class UserEnroll extends PureComponent {
  constructor(props) {
    super(props)
  }

  enrollUser(phoneNumber, id, seed, verKey) {
    getItem(PUSH_COM_METHOD)
      .then(pushComMethod => {
        if (pushComMethod) {
          this.props.enrollAction(
            {
              phoneNumber,
              id,
              verKey,
              pushComMethod,
            },
            this.props.config
          )
        } else {
          console.log('LOG: error Device PushComMethod not present')
        }
      })
      .catch(function(error) {
        console.log('LOG: error setItem token, ', error)
      })
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
          this.enrollUser(
            phoneNumber,
            identifier,
            seed,
            getVerificationKey(seed)
          )
          setItem(SEED, seed)
        }
      })
      .catch(error => {
        console.log(
          'LOG: error getItem for identifier, phone and seed failed, ',
          error
        )
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config !== this.props.config) {
      Promise.all([getItem('identifier'), getItem('phone'), getItem('seed')])
        .then(([identifier, phoneNumber, seed]) => {
          if (identifier && phoneNumber && seed) {
            // since config is changed, enroll user again on different environment
            this.enrollUser(
              phoneNumber,
              identifier,
              seed,
              getVerificationKey(seed)
            )
          } else {
            throw 'phoneNumber or identifier or seed is not available'
          }
        })
        .catch(console.log)
    }
  }

  render() {
    return null
  }
}

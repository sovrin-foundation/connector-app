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

  startUserEnrollment = () => {
    if (this.props.config.isHydrated) {
      if (!this.props.config.isAlreadyInstalled) {
        // if we hydrated our store and it is a fresh installation,
        // then go ahead and register new user
        const phoneNumber = (Math.random() * 1000000000000000000)
          .toString()
          .substring(0, 10)
        const identifier = randomSeed(32).substring(0, 22)
        const seed = randomSeed(32).substring(0, 32)
        this.enrollUser(phoneNumber, identifier, seed, getVerificationKey(seed))
        setItem(SEED, seed)
      } else {
        // what to do if not a fresh installation
      }
    } else {
      // just wait for it to be called after hydrated
    }
  }

  componentWillMount() {
    // try user enrolllment as soon as we got push notification permission from user
    // this might trigger again if app store is not yet hydrated
    this.startUserEnrollment()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config.agencyUrl !== this.props.config.agencyUrl) {
      // if the server environment is changed, enroll user again
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

    if (nextProps.config.isHydrated !== this.props.config.isHydrated) {
      // if store is hydrated after we got push notification permission
      this.startUserEnrollment()
    }
  }

  render() {
    return null
  }
}

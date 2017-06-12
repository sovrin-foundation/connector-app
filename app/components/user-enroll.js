import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { invitationReceived } from '../store'
import { setItem, getItem } from '../services/secure-storage'
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import bs58 from 'bs58'
import { enroll, poll } from '../home/home-store'
import {
  PUSH_COM_METHOD,
  IDENTIFIER,
  PHONE,
  SEED,
} from '../common/secure-storage-constants'

class UserEnroll extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { identifier, phone, seed } = this.props.secureStorageStore.data
    if (!identifier || !phone || !seed) {
      this.enroll()
    } else {
      // TODO:KS Add signature
      this.props.poll(identifier)
    }
  }

  enroll = () => {
    let phoneNumber = (Math.random() * 1000000000000000000)
      .toString()
      .substring(0, 10)
    let id = randomSeed(32).substring(0, 22)
    let seed = randomSeed(32).substring(0, 32)
    let { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(seed)
    verKey = bs58.encode(verKey)
    this.enrollUser(phoneNumber, id, seed, verKey)
  }

  enrollUser(phoneNumber, id, seed, verKey) {
    if (this.props.pnStore.isPNAllowed) {
      getItem(PUSH_COM_METHOD)
        .then(pushComMethod => {
          if (pushComMethod) {
            // TODO:KS Add signature
            this.props.enroll({
              phoneNumber,
              id,
              verKey,
              pushComMethod,
            })
          } else {
            console.error('LOG: Device PushComMethod not present')
          }
        })
        .catch(error => {
          console.error('LOG: enrollUser getItem failed, ', error)
        })
    } else {
      setTimeout(() => {
        this.enrollUser(phoneNumber, id, seed, verKey)
      }, 2000)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  home: state.home,
  pnStore: state.pnStore,
  secureStorageStore: state.secureStorageStore,
})

const mapDispatchToProps = dispatch => ({
  enroll: device => dispatch(enroll(device)),
  poll: identifier => dispatch(poll(identifier)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserEnroll)

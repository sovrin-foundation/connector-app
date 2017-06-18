import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { invitationReceived, getSecureStorage } from '../store'
import { setItem, getItem } from '../services/secure-storage'
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import bs58 from 'bs58'
import { enroll } from '../home/home-store'
import {
  PUSH_COM_METHOD,
  SEED,
  IDENTIFIER,
  PHONE,
} from '../common/secure-storage-constants'

export class UserEnroll extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {
      identifier,
      phoneNumber,
      seed,
      pushComMethod,
    } = this.props.secureStorageStore.data
    if (!identifier || !phoneNumber || !seed) {
      let phoneNumber = (Math.random() * 1000000000000000000)
        .toString()
        .substring(0, 10)
      let id = randomSeed(32).substring(0, 22)
      let seed = randomSeed(32).substring(0, 32)
      let { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
        seed
      )
      verKey = bs58.encode(verKey)
      this.enrollUser(phoneNumber, id, seed, verKey, pushComMethod)
      setItem(SEED, seed)
      setItem(PHONE, phoneNumber)
      setItem(IDENTIFIER, id)
    }
  }

  enrollUser(phoneNumber, id, seed, verKey, pushComMethod) {
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
  }

  render() {
    const { enrollResponse } = this.props.home
    console.log(enrollResponse)
    if (
      enrollResponse &&
      enrollResponse.data &&
      enrollResponse.data.status === 200
    ) {
      this.props.loadSecureStorage()
    }
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
  loadSecureStorage: () => dispatch(getSecureStorage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserEnroll)

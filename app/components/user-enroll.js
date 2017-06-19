import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { invitationReceived } from '../store'
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
    Promise.all([getItem('identifier'), getItem('phone'), getItem('seed')])
      .then(([identifier, phoneNumber, seed]) => {
        if (identifier || phoneNumber || seed) {
          let phoneNumber = (Math.random() * 1000000000000000000)
            .toString()
            .substring(0, 10)
          let id = randomSeed(32).substring(0, 22)
          let seed = randomSeed(32).substring(0, 32)
          let { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(
            seed
          )
          verKey = bs58.encode(verKey)
          this.enrollUser(phoneNumber, id, seed, verKey)
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

  enrollUser(phoneNumber, id, seed, verKey) {
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

const mapStateToProps = state => ({
  home: state.home,
  pnStore: state.pnStore,
})

const mapDispatchToProps = dispatch => ({
  enroll: device => dispatch(enroll(device)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserEnroll)

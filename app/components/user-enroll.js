import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { invitationReceived } from '../store'
import { setItem, getItem } from '../services/secure-storage'
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import bs58 from 'bs58'
import { Enroll, Poll } from '../home/home-store'

class UserEnroll extends PureComponent {
  constructor(props) {
    super(props)
    this.state = this.props.home
  }

  componentWillMount() {
    Promise.all([getItem('identifier'), getItem('phone'), getItem('seed')])
      .then(([identifier, phone, seed]) => {
        if (!identifier || !phone || !seed) {
          this.enroll()
        } else {
          // TODO:KS Add signature
          this.props.poll(identifier)
        }
      })
      .catch(error => {
        console.log(
          'LOG: getItem for identifier, phone and seed failed, ',
          error
        )
      })
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
    if (this.props.PNStore.isPNAllowed) {
      getItem('pushComMethod')
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
  PNStore: state.PNStore,
})

const mapDispatchToProps = dispatch => ({
  enroll: device => dispatch(Enroll(device)),
  poll: identifier => dispatch(Poll(identifier)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserEnroll)

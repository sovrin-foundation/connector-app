import React, { PureComponent } from 'react'
import { View, AlertIOS } from 'react-native'
import { connect } from 'react-redux'
import { getItem } from '../services/secure-storage'
import { IDENTIFIER, PHONE } from '../common/secure-storage-constants'
import { avatarTapped, sendUserInfo } from '../home/home-store'

class Alert extends PureComponent {
  constructor(props) {
    super(props)
  }

  showAlert() {
    this.props.avatarTapped(-1)
    Promise.all([getItem(IDENTIFIER), getItem(PHONE)])
      .then(([identifier, phoneNumber]) => {
        if (identifier || phoneNumber) {
          AlertIOS.alert('Identifier or phone not present')
        } else {
          AlertIOS.alert(
            `Identifier - ${identifier}`,
            `Phone Number - ${phoneNumber}`
          )
          this.props.userInfo({
            phoneNumber,
            identifier,
          })
        }
      })
      .catch(error => {
        console.log(
          'LOG: getItem for identifier or phoneNumber failed, ',
          error
        )
      })
  }

  render() {
    if (this.props.home.avatarTapCount == 3) {
      this.showAlert()
    }
    return null
  }
}

const mapStateToProps = state => ({
  home: state.home,
})

const mapDispatchToProps = dispatch => ({
  avatarTapped: count => dispatch(avatarTapped(count)),
  userInfo: context => dispatch(sendUserInfo(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Alert)

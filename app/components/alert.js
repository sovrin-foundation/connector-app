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

  componentWillMount() {
    this.props.avatarTapped(-1)
    const { identifier, phoneNumber } = this.props.secureStorageStore.data
    if (!identifier || !phoneNumber) {
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
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  home: state.home,
  secureStorageStore: state.secureStorageStore,
})

const mapDispatchToProps = dispatch => ({
  avatarTapped: count => dispatch(avatarTapped(count)),
  userInfo: context => dispatch(sendUserInfo(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Alert)

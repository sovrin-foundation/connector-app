import React, { PureComponent } from 'react'
import { AlertIOS } from 'react-native'
import { getItem } from '../services/secure-storage'
import { IDENTIFIER, PHONE } from '../common/secure-storage-constants'

export default class Alert extends PureComponent {
  constructor(props) {
    super(props)
  }

  onAlertClose = (identifier, phoneNumber) => {
    this.props.onClose(
      {
        phoneNumber,
        identifier,
      },
      this.props.config
    )
    this.props.reset()
  }

  showData = () => {
    if (this.props.config.isHydrated) {
      Promise.all([getItem('identifier'), getItem('phone')])
        .then(([identifier, phoneNumber]) => {
          if (!identifier || !phoneNumber) {
            AlertIOS.alert('Error', 'Identifier or phone not present', [
              {
                onPress: () => this.props.reset(),
              },
            ])
          } else {
            AlertIOS.alert(
              `Identifier - ${identifier}`,
              `Phone Number - ${phoneNumber}`,
              [{ onPress: () => this.onAlertClose(identifier, phoneNumber) }]
            )
          }
        })
        .catch(error => {
          console.log('LOG: getItem for identifier and phone failed, ', error)
        })
    }
  }

  componentWillMount() {
    this.showData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config.isHydrated !== this.props.isHydrated) {
      this.showData()
    }
  }

  render() {
    return null
  }
}

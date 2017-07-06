import React, { PureComponent } from 'react'
import { AlertIOS } from 'react-native'
import { getItem } from '../services/secure-storage'
import {
  IDENTIFIER,
  PHONE,
  PUSH_COM_METHOD,
} from '../common/secure-storage-constants'

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
      Promise.all([
        getItem(IDENTIFIER),
        getItem(PHONE),
        getItem(PUSH_COM_METHOD),
      ])
        .then(([identifier, phoneNumber, pushComMethod]) => {
          if (!identifier || !phoneNumber || !pushComMethod) {
            AlertIOS.alert(
              'Error',
              'Identifier or phone or push-notification token not present',
              [
                {
                  onPress: () => this.props.reset(),
                },
              ]
            )
          } else {
            AlertIOS.alert(
              `Identifier - ${identifier}`,
              `PushToken - ${pushComMethod} - Phone Number - ${phoneNumber}`,
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

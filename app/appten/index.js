// @flow
import React, { PureComponent } from 'react'
import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native'
import { apptentiveCredentials } from '../common'

const configuration = new ApptentiveConfiguration(
  apptentiveCredentials.apptentiveKey,
  apptentiveCredentials.apptentiveSignature
)
export default class Appten extends PureComponent {
  componentDidMount() {
    configuration.logLevel = 'verbose'
    Apptentive.register(configuration)
      .then(() => {
        Apptentive.onUnreadMessageCountChanged = count => {
          this.setState({ unreadMessageCount: count })
        }
        Apptentive.onAuthenticationFailed = reason => {
          showAlert('Error', `Authentication failed:\n${reason}`)
        }
      })
      .catch(error => {
        showAlert('Error', `Can't register Apptentive:\n${error.message}`)
      })
  }

  render() {
    return null
  }
}

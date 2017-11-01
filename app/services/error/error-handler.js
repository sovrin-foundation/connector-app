// @flow
import { AlertIOS } from 'react-native'
import ErrorTracker from './error-tracker'

export const captureError = (error: Error, showAlert: boolean = false) => {
  ErrorTracker.captureException(error)
  if (showAlert) {
    AlertIOS.alert(JSON.stringify(error))
  }
}

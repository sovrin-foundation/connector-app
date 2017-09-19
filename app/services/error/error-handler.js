// @flow

import { AlertIOS } from 'react-native'
import ErrorTracker from './error-tracker'

export const captureError = (error: any) => {
  ErrorTracker.captureException(error)
  AlertIOS.alert(JSON.stringify(error))
}

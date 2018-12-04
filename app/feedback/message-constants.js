// @flow
import { Platform } from 'react-native'

export const apptentiveCredentials = Platform.select({
  ios: {
    apptentiveKey: '***REMOVED***',
    apptentiveSignature: '***REMOVED***',
  },
  android: {
    apptentiveKey: '***REMOVED***',
    apptentiveSignature: '***REMOVED***',
  },
})

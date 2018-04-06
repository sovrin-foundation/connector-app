import { Platform } from 'react-native'

export const apptentiveCredentials = Platform.select({
  ios: {
    apptentiveKey: '***REMOVED***',
    apptentiveSignature: '***REMOVED***',
  },
  android: {
    apptentiveKey: '<YOUR_ANDROID_APPTENTIVE_KEY>',
    apptentiveSignature: '<YOUR_ANDROID_APPTENTIVE_SIGNATURE>',
  },
})

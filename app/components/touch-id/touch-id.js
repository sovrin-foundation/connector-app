// @flow
import RNTouchId from 'react-native-touch-id'

export default RNTouchId

export const TouchId = {
  authenticate(message: string, callback: () => void) {
    return new Promise((resolve, reject) => {
      RNTouchId.authenticate(message)
        .then(resolve)
        .catch(error => {
          if (error.name === 'LAErrorSystemCancel') {
            setTimeout(callback, 1000)
          }
          reject(error)
        })
    })
  },
}

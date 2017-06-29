import React from 'react'
import { AlertIOS } from 'react-native'
import renderer from 'react-test-renderer'
import Alert from '../alert'

AlertIOS.alert = jest.fn()

function props() {
  return {
    onClose: jest.fn(),
    reset: jest.fn(),
    config: {
      isHydrated: true,
    },
  }
}

describe('user avatar section info', () => {
  it('should show alert and call action onClose', done => {
    const alertProps = props()
    renderer.create(<Alert {...alertProps} />)

    setTimeout(function() {
      expect(AlertIOS.alert.mock.calls[0][2].length).toEqual(1)
      AlertIOS.alert.mock.calls[0][2][0].onPress()
      expect(alertProps.onClose).toBeCalled()
      done()
    }, 2000)
  })
})

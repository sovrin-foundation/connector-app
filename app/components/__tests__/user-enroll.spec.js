import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import UserEnroll from '../user-enroll'

function props() {
  return {
    enrollAction: jest.fn(),
    config: {
      isHydrated: true,
      isAlreadyInstalled: false,
      agencyUrl: 'https://agency.evernym.com',
      callCenterUrl: 'https://cua.culedger.com',
    },
  }
}

describe('user enroll component', () => {
  it('should call enroll action', done => {
    const enrollProps = props()
    renderer.create(<UserEnroll {...enrollProps} />)
    setTimeout(() => {
      expect(enrollProps.enrollAction).toBeCalled()
      done()
    }, 2000)
  })
})

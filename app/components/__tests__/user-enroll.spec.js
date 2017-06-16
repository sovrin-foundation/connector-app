import 'react-native'
import React from 'react'
import renderer from 'react-native-renderer'
import { UserEnroll } from './user-enroll'

function props() {
  return {
    home: {},
    pnStore: {},
    secureStorageStore: {},
    enroll: jest.fn(),
  }
}

describe('enroll page should', () => {
  it('should send enroll requests', () => {
    expect(renderer.create(<UserEnroll />).toJSON()).toMatchSnapshot()
  })
})

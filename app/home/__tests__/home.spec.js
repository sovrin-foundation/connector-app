import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

// un-comment it when don't want to skip this test
// import { HomeScreenDrawer } from '../home'

function props() {
  return {
    user: {},
    connections: {},
    loadUserInfo: jest.fn(),
    loadConnections: jest.fn(),
    invitationReceived: jest.fn(),
  }
}

describe('home page should', () => {
  xit('redirect user to invitation page once invitation is receieved', () => {
    expect(renderer.create(<HomeScreenDrawer />).toJSON()).toMatchSnapshot()
  })
})

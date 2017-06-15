import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { HomeScreenDrawer } from '../home'

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

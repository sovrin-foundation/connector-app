import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { mock as mockAsyncStorage } from 'mock-async-storage'

mockAsyncStorage()

import { HomeScreenDrawer } from '../home'

function props() {
  const commonInitiaProps = {
    isFetching: false,
    isPristine: true,
    data: null,
    error: null,
  }

  return {
    user: {
      isFetching: false,
      isPrestine: true,
      error: {},
      data: {},
    },
    connections: {},
    loadUserInfo: jest.fn(),
    loadConnections: jest.fn(),
    // invitationReceived: jest.fn(),
    pushNotificationPermissionAction: jest.fn(),
    pushNotification: { isPNAllowed: true },
    home: {
      avatarTapCount: 0,
      enrollResponse: commonInitiaProps,
      userInfoResponse: commonInitiaProps,
    },
  }
}

describe('home page should', () => {
  xit('redirect user to invitation page once invitation is receieved', () => {
    const homeProps = props()
    const okInit = { status: 200 }

    // mock response for API calls
    fetch.mockResponseOnce(
      JSON.stringify({ status: 'NO_RESPONSE_YET' }),
      okInit
    )
    fetch.mockResponseOnce(
      JSON.stringify({ status: 'NO_RESPONSE_YET' }),
      okInit
    )

    const component = renderer.create(<HomeScreenDrawer {...homeProps} />)
    component.pushNotificationPermissionAction = true

    let tree = component.toJSON()

    setTimeout(() => {
      expect(tree).toMatchSnapshot()
      // expect that fetch is called twice, once for enrollUser and once for poll
      expect(fetch.mock.calls.length).toBeGreaterThan(1)
      // TODO:KS Add more expect statements to check for other functionalities
    }, 5000)
  })
})

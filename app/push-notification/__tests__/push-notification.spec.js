// @flow
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { PushNotification } from '../push-notification'

// mock connected component
jest.mock('../push-notification-navigator', () => 'PushNotificationNavigator')

describe('<PushNotification />', () => {
  let store = {}

  beforeAll(() => {
    store = {
      getState() {
        return jest.fn()
      },
      subscribe() {
        return jest.fn()
      },
      dispatch() {
        return jest.fn()
      },
    }
  })

  function props() {
    return {
      navigateToRoute: jest.fn(),
    }
  }

  it('should render PushNotification Navigator components properly', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <PushNotification {...props()} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

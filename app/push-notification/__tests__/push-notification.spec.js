// @flow
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { PushNotification } from '../push-notification'
import { getStore } from '../../../__mocks__/static-data'

// mock connected component
jest.mock('../push-notification-navigator', () => 'PushNotificationNavigator')

describe('<PushNotification />', () => {
  const store = getStore()

  function props() {
    return {
      navigateToRoute: jest.fn(),
      fetchAdditionalData: jest.fn(),
      pushNotificationPermissionAction: jest.fn(),
      updatePushToken: jest.fn(),
      isAllowed: false,
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

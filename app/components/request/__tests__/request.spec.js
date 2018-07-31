// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import TouchId from 'react-native-touch-id'
import FCM from 'react-native-fcm'
import { Request } from '../request'
import type { RequestProps, ResponseTypes } from '../type-request'
import { color } from '../../../common/styles/constant'
import { lockAuthorizationRoute } from '../../../common/route-constants'
import { getNavigation, getStore } from '../../../../__mocks__/static-data'

describe('<Request />', () => {
  let store
  let request
  let requestComponent
  let tree
  const accepted = 'accepted'
  const rejected = 'rejected'
  const defaultProps = {
    title: 'Hi Test User',
    message: 'Enterprise A agent wants to connect with you',
    senderLogoUrl: 'https://image.url',
    onAction: jest.fn(),
    showErrorAlerts: false,
    testID: 'request',
    isTouchIdEnabled: true,
    pushNotificationPermissionAction: jest.fn(),
  }
  let navigation

  beforeAll(() => {
    store = getStore()
  })

  beforeEach(() => {
    navigation = getNavigation({ onSuccess: jest.fn() })

    // onAction = jest.fn()
    request = renderer.create(
      <Provider store={store}>
        <Request
          {...defaultProps}
          onAction={defaultProps.onAction}
          navigation={navigation}
          showErrorAlerts={defaultProps.showErrorAlerts}
        />
      </Provider>
    )
    tree = request.toJSON()
    requestComponent = request.root.findByType(Request).instance
  })

  it('should match snapshot', () => {
    expect(tree).toMatchSnapshot()
  })

  it('TouchId and calls onAction if Connect/Deny button is pressed', async () => {
    const touchIdAuth = await requestComponent.onAccept()
    await touchIdAuth
    expect(defaultProps.onAction).toBeCalled()
    expect(defaultProps.onAction).toHaveBeenCalledWith(accepted)
  })

  it('redirect user to lock authorization page if TouchId fails', async () => {
    TouchId.authenticate.mockImplementation(message => Promise.reject())
    await requestComponent.authenticate(accepted)
    expect(navigation.navigate).toHaveBeenCalledWith(lockAuthorizationRoute, {
      onSuccess: expect.any(Function),
      onAvoid: expect.any(Function),
    })
  })

  it('call authenticate even if user allow push notification', async () => {
    await requestComponent.onAction(accepted)
    expect(defaultProps.onAction).toHaveBeenCalledWith(accepted)
  })

  it('call authenticate even if user does not allow push notification', async () => {
    FCM.requestPermissions.mockImplementation(() => Promise.reject())
    await requestComponent.onAction(accepted)
    expect(defaultProps.onAction).toHaveBeenCalledWith(accepted)
  })
})

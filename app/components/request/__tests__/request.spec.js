// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import Request from '../request'
import type { RequestProps, ResponseTypes } from '../type-request'
import { color } from '../../../common/styles/constant'

describe('<Request />', () => {
  let store = {}
  beforeAll(() => {
    store = {
      getState() {
        return {
          connections: {
            connectionThemes: {
              default: {
                primary: `rgba(${color.actions.button.primary.rgba})`,
                secondary: `rgba(${color.actions.button.secondary.rgba})`,
              },
            },
          },
        }
      },
      subscribe() {
        return jest.fn()
      },
      dispatch() {
        return jest.fn()
      },
    }
  })

  let request
  let requestComponent
  let tree
  const defaultProps: RequestProps = {
    title: 'Hi Test User',
    message: 'Enterprise A agent wants to connect with you',
    senderLogoUrl: 'https://image.url',
    onAction: jest.fn(),
    showErrorAlerts: false,
  }

  beforeEach(() => {
    // onAction = jest.fn()
    request = renderer.create(
      <Provider store={store}>
        <Request
          {...defaultProps}
          showErrorAlerts={defaultProps.showErrorAlerts}
          onAction={defaultProps.onAction}
        />
      </Provider>
    )
    tree = request.toJSON()
    requestComponent = request.getInstance()._reactInternalInstance.child
      .stateNode
  })

  it('should match snapshot', () => {
    expect(tree).toMatchSnapshot()
  })

  it('bypass touch id and calls onAction with accepted', async () => {
    // click title four times to disable touch id
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    // click on accept button
    await requestComponent.onAccept()
    // check if passed onAction is called
    expect(defaultProps.onAction).toBeCalled()
    expect(defaultProps.onAction).toHaveBeenCalledWith('accepted')
  })

  it('bypass touch id and calls onAction with rejected', async () => {
    // click title four times to disable touch id
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    // click on accept button
    await requestComponent.onDecline()
    // check if passed onAction is called
    expect(defaultProps.onAction).toBeCalled()
    expect(defaultProps.onAction).toHaveBeenCalledWith('rejected')
  })

  it('TouchId and calls onAction if Allow/Deny button is pressed', async () => {
    const touchIdAuth = await requestComponent.onAccept()
    await touchIdAuth
    expect(defaultProps.onAction).toBeCalled()
    expect(defaultProps.onAction).toHaveBeenCalledWith('accepted')
  })
})

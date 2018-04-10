// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { authenticationRoute } from '../../common/'
import { PUSH_NOTIFICATION_SENT_CODE } from '../../api/api-constants'
import AuthenticationScreen from '../authentication'
import { color } from '../../common/styles'

describe('<AuthenticationScreen />', () => {
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
          route: {
            currentScreen: authenticationRoute,
          },
          authentication: {
            data: {
              offerMsgTitle: 'Hi There',
              offerMsgText:
                'Suncoast Credit Union (sandbox) wants to connect with you',
              statusCode: PUSH_NOTIFICATION_SENT_CODE,
              logoUrl: null,
              remoteConnectionId: 'B4Y9fhpeHdGHBKKtSgAYrB',
            },
          },
          config: {
            showErrorAlerts: false,
          },
          user: {
            avatarName: undefined,
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

  it('should match snapshot', () => {
    const component = renderer.create(
      <Provider store={store}>
        <AuthenticationScreen showErrorAlerts />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

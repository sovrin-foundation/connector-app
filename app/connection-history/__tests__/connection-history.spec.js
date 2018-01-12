// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectionHistory } from '../connection-history'
import { color } from '../../common/styles'

describe('<ConnectionHistory />', () => {
  let store = {}

  beforeAll(() => {
    store = {
      getState() {
        return {
          connections: {
            connectionThemes: {
              active: {
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

  function props() {
    return {
      navigation: {
        state: {
          params: {
            image: 'https://test.com/image.png',
            senderName: 'Evernym',
          },
        },
      },
      activeConnectionThemePrimary: `rgba(${color.actions.button.primary
        .rgba})`,
      activeConnectionThemeSecondary: `rgba(${color.actions.button.secondary
        .rgba})`,
      connectionHistory: {
        'September 2017': [
          {
            id: '1',
            type: 'connection',
            icon: require('../images/linked.png'),
            action: 'CONNECTED',
            date: '2017-09-06T00:00:00+05:30',
            data: [
              {
                label: 'Evernym',
                data: '2017-09-06T00:00:00+05:30',
              },
            ],
          },
        ],
      },
    }
  }

  it('should ConnectionHistory render properly', () => {
    const component = renderer.create(
      <Provider store={store}>
        <ConnectionHistory {...props()} />
      </Provider>
    )
    expect(component).toMatchSnapshot()
  })
})

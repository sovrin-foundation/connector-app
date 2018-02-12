// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectionHistory } from '../connection-history'
import { color } from '../../common/styles'
import { getStore, getNavigation } from '../../../__mocks__/static-data'

describe('<ConnectionHistory />', () => {
  const store = getStore()

  // TODO:PS: Move this to static-data
  function props() {
    return {
      navigation: getNavigation({
        image: 'https://test.com/image.png',
        senderName: 'Evernym',
      }),
      activeConnectionThemePrimary: `rgba(${
        color.actions.button.primary.rgba
      })`,
      activeConnectionThemeSecondary: `rgba(${
        color.actions.button.secondary.rgba
      })`,
      connectionHistory: {
        'September 2017': [
          {
            id: '1',
            type: 'INVITATION',
            icon: require('../images/linked.png'),
            action: 'CONNECTED',
            timestamp: '2017-09-06T00:00:00+05:30',
            data: [
              {
                label: 'Evernym',
                data: '2017-09-06T00:00:00+05:30',
              },
            ],
            name: 'Enterprise name',
            status: 'INVITATION_RECEIVED',
            remoteDid: 'remoteDid',
            originalPayload: {},
          },
        ],
      },
      claimMap: undefined,
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

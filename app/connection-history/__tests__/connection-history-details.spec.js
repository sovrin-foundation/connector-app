// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectionHistoryDetails } from '../connection-history-details'

describe('<ConnectionHistoryDetails />', () => {
  function props() {
    return {
      navigation: {
        state: {
          params: {
            type: 'claim',
          },
        },
      },
    }
  }

  it('should ConnectionHistoryDetails render properly', () => {
    const component = renderer.create(<ConnectionHistoryDetails {...props()} />)
    expect(component).toMatchSnapshot()
  })
})

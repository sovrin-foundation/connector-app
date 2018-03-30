// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectionHistoryDetails } from '../connection-history-details'

//TODO:RG fix test - add tests for history actions like RECEIVED and SHARED
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

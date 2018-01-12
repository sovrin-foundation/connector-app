// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import CustomDate from '../custom-date'

describe('<CustomDate />', () => {
  function props() {
    return {
      format: 'MM/DD/YYYY',
    }
  }

  it('should ConnectionHistoryDetails render properly', () => {
    const component = renderer.create(
      <CustomDate {...props()}>{'2018-01-10T04:32:43+05:30'}</CustomDate>
    )
    expect(component).toMatchSnapshot()
  })
})

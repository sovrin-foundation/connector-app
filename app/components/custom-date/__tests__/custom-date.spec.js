// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import CustomDate from '../custom-date'

describe('<CustomDate />', () => {
  it('should ConnectionHistoryDetails render properly', () => {
    const component = renderer.create(
      <CustomDate>{'2018-01-10T04:32:43+05:30'}</CustomDate>
    )
    expect(component).toMatchSnapshot()
  })
})

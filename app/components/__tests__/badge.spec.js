// @flow
import React from 'react'
import 'react-native'
import Badge from '../badge'
import renderer from 'react-test-renderer'

describe('<Badge />', () => {
  function getProps() {
    return {
      count: 10,
      secondary: false,
      badgeStyle: {},
      shadow: false,
      onPress: jest.fn(),
    }
  }

  it('should render light colored badge', () => {
    const props = getProps()
    const badge = renderer.create(<Badge {...props} center={true} />).toJSON()
    expect(badge).toMatchSnapshot()
  })

  it('should render dark colored badge', () => {
    const props = getProps()
    const badge = renderer.create(<Badge {...props} text={10} />).toJSON()
    expect(badge).toMatchSnapshot()
  })
})

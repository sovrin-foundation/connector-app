import React from 'react'
import 'react-native'
import Badge from '../badge'
import renderer from 'react-test-renderer'

describe('<Badge />', () => {
  it('should render light colored badge', () => {
    const badge = renderer.create(<Badge count={10} center={true} />).toJSON()
    expect(badge).toMatchSnapshot()
  })

  it('should render dark colored badge', () => {
    const badge = renderer.create(<Badge count={10} text={10} />).toJSON()
    expect(badge).toMatchSnapshot()
  })
})

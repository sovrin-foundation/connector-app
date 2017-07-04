import React from 'react'
import { shallow } from 'enzyme'
import Badge, { BadgeLabel } from '../badge'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

describe('<Badge />', () => {
  it('should render light colored badge', () => {
    const center = true
    const badge = shallow(<Badge count={10} center={center} />).dive()
    expect(badge.find(BadgeLabel).props()).toMatchObject({ center })
  })

  it('should render dark colored badge', () => {
    const text = 10
    const badge = shallow(<Badge count={10} text={text} />).dive()
    expect(badge.find(BadgeLabel).props()).toMatchObject({ text })
  })
})

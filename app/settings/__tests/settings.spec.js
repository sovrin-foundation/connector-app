import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Settings } from '../settings'

describe('user settings screen', () => {
  it('should render properly and snapshot should match', () => {
    const tree = renderer.create(<Settings />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

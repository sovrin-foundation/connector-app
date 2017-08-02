import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Settings } from '../settings'

describe('user settings screen', () => {
  xit('should render properly and snapshot should match', () => {
    const component = renderer.create(<Settings />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

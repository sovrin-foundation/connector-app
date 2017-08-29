import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import LockSelection from '../lock-selection'

describe('app lock selection page should', () => {
  it('render properly', () => {
    const component = renderer.create(<LockSelection />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

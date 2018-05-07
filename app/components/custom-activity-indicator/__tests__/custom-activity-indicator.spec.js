// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import CustomActivityIndicator from '../custom-activity-indicator'

describe('<CustomActivityIndicator />', () => {
  it('should render properly and match the snapshot', () => {
    const component = renderer.create(<CustomActivityIndicator />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

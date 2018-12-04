// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import LoadingIndicator from '../loading-indicator'

describe('<LoadingIndicator />', () => {
  it('should render properly and match the snapshot', () => {
    const component = renderer.create(<LoadingIndicator size={30} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

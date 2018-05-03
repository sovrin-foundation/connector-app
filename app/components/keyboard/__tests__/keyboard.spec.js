// @flow

import React from 'react'
import renderer from 'react-test-renderer'
import Keyboard from '../keyboard'

describe('<Keyboard />', () => {
  const keyboardProps = {
    maxLength: 9,
    color: '#fff',
    onPress: jest.fn(),
  }

  function setup() {
    const component = renderer.create(<Keyboard {...keyboardProps} />)
    const instance = component.getInstance()

    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

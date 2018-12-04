// @flow

import React from 'react'
import renderer from 'react-test-renderer'
import Keyboard from '../keyboard'
import { walletBalance } from '../../../../__mocks__/static-data'

describe('<Keyboard />', () => {
  const keyboardProps = {
    maxLength: 20,
    color: '#fff',
    onPress: jest.fn(),
    maxValue: walletBalance.data.toString(),
    afterDecimalSeparatorMaxLength: 8,
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

  // TODO: Add extensive tests for onPress function of Keyboard
})

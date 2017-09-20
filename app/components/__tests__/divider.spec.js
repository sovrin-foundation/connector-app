import React from 'react'
import 'react-native'
import { Text, View } from 'react-native'
import renderer from 'react-test-renderer'
import Divider from '../divider'
import { Container } from '../layout'

describe('<Divider />', () => {
  it('should render divider with left and right', () => {
    const divider = renderer
      .create(<Divider left={<Text>Test Text</Text>} />)
      .toJSON()
    expect(divider).toMatchSnapshot()
  })

  it('should render only right, if only right child is provided', () => {
    const divider = renderer
      .create(<Divider right={<Text>Right</Text>} />)
      .toJSON()
    expect(divider).toMatchSnapshot()
  })
})

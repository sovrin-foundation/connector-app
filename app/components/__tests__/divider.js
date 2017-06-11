import { Text, View } from 'react-native'
import React from 'react'
import { shallow } from 'enzyme'
import Divider from '../divider'
import { Container } from '../layout'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

describe('<Divider />', () => {
  it('should render divider with left and right', () => {
    const divider = renderer
      .create(<Divider left={<Text>Test Text</Text>} />)
      .toJSON()
    expect(divider).toMatchSnapshot()
  })

  it('should render only left, if only left child is provided', () => {
    const divider = shallow(<Divider left={<Text>Left</Text>} />)
    expect(divider.find(Container).length).toBe(2)
  })

  it('should render only right, if only right child is provided', () => {
    const divider = shallow(<Divider right={<Text>Right</Text>} />)
    expect(divider.find(Container).length).toBe(2)
  })
})

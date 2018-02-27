import Bubbles from '../../home/bubbles'
import React from 'react'
import renderer from 'react-test-renderer'
import { connections } from '../../../__mocks__/static-data'
describe('<Bubbles/>', () => {
  it('should render Bubbles', () => {
    const props = {
      connections,
    }
    const wrapper = renderer.create(<Bubbles {...props} />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

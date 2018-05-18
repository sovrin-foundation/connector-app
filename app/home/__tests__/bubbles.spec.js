// @flow
import Bubbles from '../../home/bubbles'
import React from 'react'
import renderer from 'react-test-renderer'
import { connections, getNavigation } from '../../../__mocks__/static-data'
import type { Connection } from '../../connection/type-connection'

describe('<Bubbles/>', () => {
  it('should render Bubbles', () => {
    const allConnections: any[] = Object.values(connections)
    const props = {
      connections: allConnections,
      navigation: getNavigation(),
      height: 300,
    }
    const wrapper = renderer.create(<Bubbles {...props} />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

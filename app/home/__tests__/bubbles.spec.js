// @flow
import Bubbles from '../../home/bubbles'
import React from 'react'
import renderer from 'react-test-renderer'
import { connections, getNavigation } from '../../../__mocks__/static-data'
import type { Connection } from '../../connection/type-connection'

describe('<Bubbles/>', () => {
  function getProps() {
    const allConnections: any[] = Object.values(connections)
    return {
      connections: allConnections,
      navigation: getNavigation(),
      height: 300,
      unSeenMessages: {},
    }
  }
  it('should render Bubbles', () => {
    const props = getProps()
    const wrapper = renderer
      .create(<Bubbles {...props} showBadge={false} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
  it('should show the dot on the Bubbles', () => {
    const props = getProps()
    const wrapper = renderer
      .create(<Bubbles {...props} showBadge={true} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

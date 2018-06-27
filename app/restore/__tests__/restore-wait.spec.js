// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { RestoreWaitScreen } from '../restore-wait'
import { getNavigation, getStore } from '../../../__mocks__/static-data'

describe('RestoreWait screen', () => {
  function getProps() {
    return {
      store: getStore(),
      navigation: getNavigation(),
    }
  }

  function setup() {
    const props = getProps()
    return { props }
  }

  it('should render properly and match the snapshot', () => {
    const { props } = setup()
    const tree = renderer.create(<RestoreWaitScreen {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  //TODO add snapshot for error screen
})

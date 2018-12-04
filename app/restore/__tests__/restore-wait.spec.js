// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { RestoreWaitScreen } from '../restore-wait'
import { getNavigation, getStore } from '../../../__mocks__/static-data'
import { restoreWaitRoute } from '../../common'

describe('RestoreWait screen', () => {
  function getProps() {
    return {
      navigation: getNavigation(),
      route: restoreWaitRoute,
      restore: getStore().getState().restore,
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

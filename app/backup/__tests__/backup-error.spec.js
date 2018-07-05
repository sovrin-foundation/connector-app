// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { BackupErrorScreen } from '../backup-error'
import { getNavigation, getStore } from '../../../__mocks__/static-data'

describe('Restore screen', () => {
  function getProps() {
    return {
      store: getStore(),
      navigation: getNavigation(),
      updateStatusBarTheme: jest.fn(),
    }
  }

  function setup() {
    const props = getProps()
    return { props }
  }

  it('should render properly and match the snapshot', () => {
    const { props } = setup()
    const tree = renderer.create(<BackupErrorScreen {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  //TODO add snapshot for error screen
})

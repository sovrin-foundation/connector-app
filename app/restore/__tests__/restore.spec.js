// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { RestoreStartScreen } from '../restore'
import { getNavigation, getStore } from '../../../__mocks__/static-data'
import { restorePassphraseRoute } from '../../common'

describe('Restore screen', () => {
  function getProps() {
    return {
      store: getStore(),
      navigation: getNavigation(),
      restore: getStore().getState().restore,
      route: restorePassphraseRoute,
      updateStatusBarTheme: jest.fn(),
      saveFileToAppDirectory: jest.fn(),
    }
  }

  function setup() {
    const props = getProps()
    return { props }
  }

  it('should render properly and match the snapshot', () => {
    const { props } = setup()
    const tree = renderer.create(<RestoreStartScreen {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  //TODO add snapshot for error screen
})

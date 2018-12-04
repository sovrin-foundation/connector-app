// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { RestorePassphrase } from '../restore-passphrase'
import { getNavigation, getStore } from '../../../__mocks__/static-data'

describe('Restore Passphrase screen', () => {
  function getProps() {
    return {
      navigation: getNavigation(),
      submitPassphrase: jest.fn(),
      restore: getStore().getState().restore,
    }
  }

  function setup() {
    const props = getProps()
    return { props }
  }

  it('should render properly and match the snapshot', () => {
    const { props } = setup()
    const tree = renderer.create(<RestorePassphrase {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

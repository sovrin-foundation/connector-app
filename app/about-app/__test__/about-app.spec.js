// @flow

import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { AboutApp } from '../about-app'
import { getStore } from '../../../__mocks__/static-data'
import { getNavigation } from '../../../__mocks__/static-data'

import type {} from '../type-about-app'

describe('user about app screen', () => {
  const props = {
    navigation: getNavigation(),
    environmentName: 'DEMO',
  }

  it('should render properly and snapshot should match', () => {
    const tree = renderer.create(<AboutApp {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

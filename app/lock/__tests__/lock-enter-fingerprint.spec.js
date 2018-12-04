// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { LockEnterFingerprint } from '../lock-enter-fingerprint'
import { homeRoute, claimOfferRoute } from '../../common'
import {
  getNavigation,
  pendingRedirection,
  getStore,
} from '../../../__mocks__/static-data'

function props() {
  return {
    switchErrorAlerts: jest.fn(),
    clearPendingRedirect: jest.fn(),
    unlockApp: jest.fn(),
    pendingRedirection,
    isAppLocked: true,
    navigation: {
      ...getNavigation(),
    },
  }
}

const store = {
  getState() {
    return jest.fn()
  },
  subscribe() {
    return jest.fn()
  },
  dispatch() {
    return jest.fn()
  },
}

describe('app lock selection page should', () => {
  it('render properly', () => {
    const component = renderer.create(
      <Provider store={getStore()}>
        <LockEnterFingerprint {...props()} />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('in case of fetching invitation show message', () => {
    const component = renderer.create(
      <Provider store={getStore()}>
        <LockEnterFingerprint {...props()} isFetchingInvitation={true} />
      </Provider>
    )
    let LockEnterFingerprintInstance = component.root.findByType(
      LockEnterFingerprint
    ).instance
    LockEnterFingerprintInstance.setState({ authenticationSuccess: true })
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

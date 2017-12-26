// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { LockEnterFingerprint } from '../lock-enter-fingerprint'

function props() {
  return {
    switchErrorAlerts: jest.fn(),
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
      <Provider store={store}>
        <LockEnterFingerprint {...props()} />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

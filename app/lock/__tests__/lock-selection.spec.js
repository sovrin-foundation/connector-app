// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { LockSelection } from '../lock-selection'

const switchErrorAlerts = jest.fn()
const longPressedInLockSelectionScreen = jest.fn()
const pressedOnOrInLockSelectionScreen = jest.fn()
function props() {
  return {
    switchErrorAlerts,
    longPressedInLockSelectionScreen: longPressedInLockSelectionScreen,
    pressedOnOrInLockSelectionScreen: pressedOnOrInLockSelectionScreen,
  }
}
const navigation = {
  navigate: jest.fn(),
  state: {
    params: {},
  },
}
const store = {
  getState() {
    return {
      lock: {},
    }
  },
  subscribe() {
    return jest.fn()
  },
  dispatch() {
    return jest.fn()
  },
}
let componentInstance, tree, wrapper
describe('app lock selection page should', () => {
  beforeEach(() => {
    wrapper = renderer.create(
      <Provider store={store}>
        <LockSelection
          {...props()}
          navigation={navigation}
          longPressedInLockSelectionScreen={longPressedInLockSelectionScreen}
          pressedOnOrInLockSelectionScreen={pressedOnOrInLockSelectionScreen}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.getInstance()._reactInternalInstance.child
      .stateNode
  })
  it('render properly', () => {
    expect(tree).toMatchSnapshot()
  })
  it('should be abel to call longPressedInLockSelectionScreen action', () => {
    componentInstance._onLongPressButton()
    expect(longPressedInLockSelectionScreen).toHaveBeenCalled()
  })
  it('should be abel to call pressedOnOrInLockSelectionScreen press action', () => {
    componentInstance._onTextPressButton()
    expect(pressedOnOrInLockSelectionScreen).toHaveBeenCalled()
  })
})

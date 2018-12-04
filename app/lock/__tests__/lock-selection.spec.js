// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { LockSelection } from '../lock-selection'
import { getStore, getNavigation } from '../../../__mocks__/static-data'

function getLockSelectionProps() {
  return {
    switchErrorAlerts: jest.fn(),
    longPressedInLockSelectionScreen: jest.fn(),
    pressedOnOrInLockSelectionScreen: jest.fn(),
    disableDevMode: jest.fn(),
    safeToDownloadSmsInvitation: jest.fn(),
  }
}

const navigation = getNavigation()
const store = getStore()

let componentInstance: LockSelection
let tree
let wrapper
let props

describe('app lock selection page should', () => {
  beforeEach(() => {
    props = getLockSelectionProps()
    wrapper = renderer.create(
      <Provider store={store}>
        <LockSelection {...props} showDevMode={false} navigation={navigation} />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(LockSelection).instance
  })

  it('render properly', () => {
    expect(tree).toMatchSnapshot()
  })

  it('should be able to call longPressedInLockSelectionScreen action', () => {
    componentInstance._onLongPressButton()
    expect(props.longPressedInLockSelectionScreen).toHaveBeenCalled()
  })

  it('should be able to call pressedOnOrInLockSelectionScreen press action', () => {
    componentInstance._onTextPressButton()
    expect(props.pressedOnOrInLockSelectionScreen).toHaveBeenCalled()
  })

  it('call safeToDownloadSmsInvitation if setup touchId', () => {
    componentInstance.goTouchIdSetup()
    expect(props.safeToDownloadSmsInvitation).toHaveBeenCalled()
  })

  it('call safeToDownloadSmsInvitation if setup pass code', () => {
    componentInstance.goPinCodeSetup()
    expect(props.safeToDownloadSmsInvitation).toHaveBeenCalled()
  })
})

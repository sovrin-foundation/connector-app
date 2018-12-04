// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { CHECK_PIN_IDLE, CHECK_PIN_FAIL, CHECK_PIN_SUCCESS } from '../type-lock'
import { LockEnterPin } from '../lock-enter-pin-code'
import {
  homeRoute,
  claimOfferRoute,
  lockPinSetupRoute,
  lockEnterPinRoute,
  lockSelectionRoute,
} from '../../common'
import {
  getStore,
  getNavigation,
  pendingRedirection,
} from '../../../__mocks__/static-data'

describe('<LockPinCodeEnter />', () => {
  const getProps = (pinStatus = CHECK_PIN_IDLE) => ({
    existingPin: true,
    pendingRedirection,
    navigation: {
      ...getNavigation(),
    },
    clearPendingRedirect: jest.fn(),
    unlockApp: jest.fn(),
    isFetchingInvitation: false,
    isAppLocked: true,
    inRecovery: 'false',
    currentScreen: lockEnterPinRoute,
  })

  let component
  let props
  let cleared
  let store
  let componentInstance

  const options = {
    createNodeMock: element => {
      return {
        clear: () => {
          cleared = true
        },
      }
    },
  }

  beforeEach(() => {
    props = getProps()
    store = getStore()

    component = renderer.create(
      <Provider store={store}>
        <LockEnterPin {...props} />
      </Provider>,
      options
    )
    componentInstance = component.root.findByType(LockEnterPin).instance
  })

  it('should render pin code box', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should navigate to pin setup onSuccess', () => {
    componentInstance.onSuccess()
    componentInstance.keyboardHideState()
    expect(props.navigation.push).toHaveBeenCalledWith(lockPinSetupRoute, {
      existingPin: true,
    })
  })

  it('redirect to pendingRedirection', () => {
    component.update(
      <Provider store={store}>
        <LockEnterPin {...props} existingPin={false} />
      </Provider>
    )
    jest.useFakeTimers()
    componentInstance.onSuccess()
    jest.runAllTimers()
    expect(props.navigation.navigate).toHaveBeenCalledTimes(2)
    expect(props.clearPendingRedirect).toHaveBeenCalled()
  })
  it('redirect to home screen is app is locked and there are no pending redirection', () => {
    component.update(
      <Provider store={store}>
        <LockEnterPin
          {...props}
          existingPin={false}
          pendingRedirection={null}
        />
      </Provider>
    )
    jest.useFakeTimers()
    componentInstance.onSuccess()
    jest.runAllTimers()
    expect(props.navigation.navigate).toHaveBeenCalledWith(homeRoute)
    expect(component).toMatchSnapshot()
  })
  it("should show 'Enter passcode' message if there is no existing pin", () => {
    const wrapper = renderer.create(
      <Provider store={store}>
        <LockEnterPin {...props} existingPin={false} />
      </Provider>,
      options
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should redirect to lockSelection screen if redirectToSetupPasscode is called', () => {
    componentInstance.redirectToSetupPasscode()
    expect(props.navigation.navigate).toHaveBeenCalledWith(lockSelectionRoute)
  })
  it('should show UNLOCKING_APP_WAIT_MESSAGE ', () => {
    let wrapper = renderer.create(
      <Provider store={store}>
        <LockEnterPin {...props} isFetchingInvitation={true} />
      </Provider>
    )
    let wrapperInstance = wrapper.root.findByType(LockEnterPin).instance
    wrapperInstance.onSuccess()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})

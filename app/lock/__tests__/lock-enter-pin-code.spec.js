// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { CHECK_PIN_IDLE, CHECK_PIN_FAIL, CHECK_PIN_SUCCESS } from '../type-lock'
import { LockEnterPin } from '../lock-enter-pin-code'

describe('<LockPinCodeEnter />', () => {
  const getProps = (pinStatus = CHECK_PIN_IDLE) => ({
    checkPinAction: jest.fn(),
    checkPinStatusIdle: jest.fn(),
    checkPinStatus: pinStatus,
    pendingRedirection: 'Home',
    switchErrorAlerts: jest.fn(),
    navigation: {
      navigate: jest.fn(),
    },
  })

  let component
  let props
  let cleared

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
    component = renderer.create(<LockEnterPin {...props} />, options)
  })

  it('should render pin code box', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should show wrong pin, if pin does not match', () => {
    jest.useFakeTimers()
    const pinFailProps = getProps(CHECK_PIN_FAIL)
    component.update(<LockEnterPin {...pinFailProps} />, options)
    jest.runAllTimers()
    expect(pinFailProps.checkPinStatusIdle).toHaveBeenCalled()
  })

  it('should redirect to pendingRedirection after pin is success', () => {
    const pinSuccessProps = getProps(CHECK_PIN_SUCCESS)
    component.update(<LockEnterPin {...pinSuccessProps} />)
    expect(props.navigation.navigate).toHaveBeenCalledWith(
      props.pendingRedirection
    )
  })
})

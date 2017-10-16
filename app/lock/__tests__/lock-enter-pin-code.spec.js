// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { CHECK_PIN_IDLE, CHECK_PIN_FAIL, CHECK_PIN_SUCCESS } from '../type-lock'
import type { LockEnterPinProps } from '../type-lock'
import type { ReactNavigation } from '../../qr-connection-request/type-qr-connection-request'
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

  const options = {
    createNodeMock: element => {
      console.log('inside createNodeMock')
      console.log(element)
      return {
        clear: () => {
          cleared = true
        },
      }
    },
  }

  let component
  let props
  let cleared
  beforeEach(() => {
    props = getProps()
    component = renderer.create(<LockEnterPin {...props} />, options)
  })

  it('should render pin code box', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  xit('should show wrong pin, if pin does not match', () => {
    jest.useFakeTimers()
    const pinFailProps = getProps(CHECK_PIN_FAIL)
    // This test is failing because react-test-renderer
    // is not calling our createNodeMock and hence `ref` is returning null
    component.update(<LockEnterPin {...pinFailProps} />, options)
    jest.runAllTimers()
    expect(props.checkPinStatusIdle).toHaveBeenCalled()
  })

  it('should redirect to pendingRedirection after pin is success', () => {
    const pinSuccessProps = getProps(CHECK_PIN_SUCCESS)
    component.update(<LockEnterPin {...pinSuccessProps} />)
    expect(props.navigation.navigate).toHaveBeenCalledWith(
      props.pendingRedirection
    )
  })
})

// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { PIN_SETUP_STATE } from '../type-lock'
import { LockPinSetup } from '../lock-pin-code-setup'
import { lockSetupSuccessRoute } from '../../common'
import { getNavigation } from '../../../__mocks__/static-data'
import { pinHash } from '../pin-hash'

describe('<LockPinCodeSetup />', () => {
  const getProps = () => ({
    setPinAction: jest.fn(),
    enableTouchIdAction: jest.fn(),
    navigation: getNavigation(),
    lockEnable: jest.fn(),
  })
  const options = {
    createNodeMock: element => {
      return {
        clear: () => {
          cleared = true
        },
        blur: () => {},
      }
    },
  }

  let component
  let props
  let cleared

  beforeEach(() => {
    props = getProps()
    component = renderer.create(<LockPinSetup {...props} />, options)
  })

  it('should render pin code box', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should show re enter pass code after first entry', () => {
    let tree = component.toJSON()
    let instance = component.getInstance()
    //manually trigger onComplete method by passing "pass code"
    instance.onPinComplete('123456')
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should redirect to lockSetupSuccessRoute after pin is success', () => {
    let instance = component.getInstance()
    //manually trigger onComplete method by passing "pass code" for first time
    instance.onPinComplete('123456')
    //manually trigger onComplete method by passing "same pass code" for second time
    instance.onPinComplete('123456')
    expect(props.navigation.navigate).toHaveBeenCalledWith(
      lockSetupSuccessRoute
    )
  })
  it('should show "pass code mismatch ..." message and reset to initial state after passcode mismatch', () => {
    jest.useFakeTimers()

    let instance = component.getInstance()
    //manually trigger onComplete method by passing "some pass code" for first time
    instance.onPinComplete('123456')
    //manually trigger onComplete method by passing "some another pass code" for second time
    instance.onPinComplete('000000')
    expect(component.toJSON()).toMatchSnapshot()
    expect(instance.state.pinSetupState).toEqual(PIN_SETUP_STATE.REENTER_FAIL)
    jest.runAllTimers()
    expect(instance.state.pinSetupState).toBe(PIN_SETUP_STATE.INITIAL)
  })

  it('hashed lock code not equal plain text lock code', () => {
    let pin = '123456'
    let salt = 'salt'
    let instance = component.getInstance()
    let hashedPin = pinHash(pin, salt)
    instance.onPinComplete(pin)
    expect(hashedPin).not.toEqual(instance.state.enteredPin)
  })
})

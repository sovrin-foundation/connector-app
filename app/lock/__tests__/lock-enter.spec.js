// @flow
import React from 'react'
import renderer from 'react-test-renderer'
import { LockEnter } from '../lock-enter'
import { CHECK_PIN_IDLE, CHECK_PIN_SUCCESS, CHECK_PIN_FAIL } from '../type-lock'
import { ENTER_YOUR_PASS_CODE_MESSAGE } from '../../common/message-constants'

describe('<LockEnter />', () => {
  function getProps() {
    return {
      checkPinAction: jest.fn(),
      checkPinStatusIdle: jest.fn(),
      switchErrorAlerts: jest.fn(),
      onSuccess: jest.fn(),
      message: ENTER_YOUR_PASS_CODE_MESSAGE,
      checkPinStatus: CHECK_PIN_IDLE,
    }
  }

  let component
  let props
  let cleared

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

  beforeEach(() => {
    props = getProps()
    component = renderer.create(
      <LockEnter {...props} fromRecovery={false} />,
      options
    )
  })

  it('should match snapshot', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('call onSuccess if pin matches', () => {
    component.update(
      <LockEnter
        {...props}
        checkPinStatus={CHECK_PIN_SUCCESS}
        fromRecovery={false}
      />
    )
    expect(props.onSuccess).toHaveBeenCalled()
  })

  it('clear pin code box if pin check fails', () => {
    jest.useFakeTimers()
    component.update(
      <LockEnter
        {...props}
        checkPinStatus={CHECK_PIN_FAIL}
        fromRecovery={false}
      />
    )
    jest.runAllTimers()
    expect(props.checkPinStatusIdle).toHaveBeenCalled()
  })
})

// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { CHECK_PIN_IDLE } from '../type-lock'
import type { LockEnterPinProps } from '../type-lock'
import { LockEnterPin } from '../lock-enter-pin-code'

describe('<LockPinCodeEnter />', () => {
  // TODO:KS Figure out why this test is failing
  xit('should render pin code box', () => {
    const props: LockEnterPinProps = {
      checkPinAction: jest.fn(),
      checkPinStatusIdle: jest.fn(),
      checkPinStatus: CHECK_PIN_IDLE,
      pendingRedirection: '',
      navigation: {
        navigate: jest.fn(),
      },
    }
    const wrapper = renderer.create(<LockEnterPin {...props} />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  // TODO:KS Complete these tests
  xit('should show wrong pin, if pin does not match', () => {})
  xit('should redirect to pendingRedirection after pin is success', () => {})
})

// @flow
import { put, call } from 'redux-saga/effects'
import type { LockStore } from '../type-lock'
import {
  SET_PIN,
  PIN_STORAGE_KEY,
  CHECK_PIN,
  CHECK_PIN_IDLE,
  LOCK_ENABLE,
} from '../type-lock'
import lockReducer, {
  addPendingRedirection,
  clearPendingRedirect,
  setPin,
  lockEnable,
  checkPin,
  checkPinSuccess,
  checkPinFail,
  setPinAction,
  checkPinStatusIdle,
} from '../lock-store'
import { setItem, getItem } from '../../services/secure-storage'

const initialState: LockStore = {
  pendingRedirection: null,
  checkPinStatus: CHECK_PIN_IDLE,
  // we are assuming that app will be locked by default
  // and it will be unlocked either when user set security first time
  // or user unlock the app every time user opens the app
  // this property needs to be set accordingly
  isAppLocked: true,
  isLockEnabled: false,
  isTouchIdEnabled: false,
}

describe('LockStore', () => {
  it('add pending redirection change state correctly', () => {
    const expectedState = lockReducer(
      initialState,
      addPendingRedirection([{ routeName: 'home' }])
    )
    expect(expectedState).toMatchSnapshot()
  })

  it('clear pending redirect if clear action is raised', () => {
    const pendingState = lockReducer(
      initialState,
      addPendingRedirection([{ routeName: 'home' }])
    )
    const expectedState = lockReducer(pendingState, clearPendingRedirect())
    expect(expectedState).toMatchSnapshot()
  })

  it('set pin should work fine', () => {
    const pin = '123456'
    const gen = setPin(setPinAction(pin))
    expect(gen.next().value).toEqual(call(setItem, PIN_STORAGE_KEY, pin))
    const lockEnableAction: any = gen.next(pin).value
    expect(lockEnableAction['PUT'].action).toEqual(
      expect.objectContaining({
        type: LOCK_ENABLE,
      })
    )
    expect(gen.next().done).toBe(true)
  })

  it('check pin flow should work if correct pin is passed', () => {
    const pin = '123456'
    const gen = checkPin({ type: CHECK_PIN, pin })
    expect(gen.next().value).toEqual(call(getItem, PIN_STORAGE_KEY))
    expect(gen.next(pin).value).toEqual(put(checkPinSuccess()))
    expect(gen.next().done).toBe(true)
  })

  it('check pin flow should fail if incorrect pin is passed', () => {
    const pin = '123456'
    const wrongPin = '123444'
    const gen = checkPin({ type: CHECK_PIN, pin })
    expect(gen.next().value).toEqual(call(getItem, PIN_STORAGE_KEY))
    expect(gen.next(wrongPin).value).toEqual(put(checkPinFail()))
    expect(gen.next().done).toBe(true)
  })

  it('should set checkPinStatus to idle', () => {
    const failedState = lockReducer(initialState, checkPinFail())
    expect(failedState).toMatchSnapshot()
    const expectedState = lockReducer(failedState, checkPinStatusIdle())
    expect(expectedState).toMatchSnapshot()
  })
})

// @flow
import { put, call } from 'redux-saga/effects'
import type { LockStore } from '../type-lock'
import {
  SET_PIN,
  PIN_STORAGE_KEY,
  CHECK_PIN,
  CHECK_PIN_IDLE,
} from '../type-lock'
import lockReducer, {
  addPendingRedirection,
  clearPendingRedirect,
  setPin,
  checkPin,
  checkPinSuccess,
  checkPinFail,
  setPinAction,
} from '../lock-store'
import { getItem, setItem } from '../../services'

const initialState: LockStore = {
  pendingRedirection: null,
  checkPinStatus: CHECK_PIN_IDLE,
  // we are assuming that app will be locked by default
  // and it will be unlocked either when user set security first time
  // or user unlock the app every time user opens the app
  // this property needs to be set accordingly
  isAppLocked: true,
}

describe('LockStore', () => {
  it('add pending redirection change state correctly', () => {
    const expectedState = lockReducer(
      initialState,
      addPendingRedirection('home')
    )
    expect(expectedState).toMatchSnapshot()
  })

  it('clear pending redirect if clear action is raised', () => {
    const pendingState = lockReducer(
      initialState,
      addPendingRedirection('home')
    )
    const expectedState = lockReducer(pendingState, clearPendingRedirect())
    expect(expectedState).toMatchSnapshot()
  })

  it('set pin should work fine', () => {
    const pin = '123456'
    const gen = setPin(setPinAction(pin))
    expect(gen.next().value).toEqual(call(setItem, PIN_STORAGE_KEY, pin))
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
})

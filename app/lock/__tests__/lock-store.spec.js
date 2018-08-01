// @flow
import { put, call } from 'redux-saga/effects'
import type { LockStore } from '../type-lock'
import {
  SET_PIN,
  PIN_STORAGE_KEY,
  CHECK_PIN,
  CHECK_PIN_IDLE,
  LOCK_ENABLE,
  SALT_STORAGE_KEY,
  PIN_ENABLED_KEY,
  IN_RECOVERY,
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
import { secureSet, secureGet, safeSet } from '../../services/storage'
import { generateSalt, pinHash } from '../pin-hash'
import { VCX_INIT_SUCCESS } from '../../store/type-config-store'

const initialState: LockStore = {
  pendingRedirection: null,
  checkPinStatus: CHECK_PIN_IDLE,
  // we are assuming that app will be locked by default
  // and it will be unlocked either when user set security first time
  // or user unlock the app every time user opens the app
  // this property needs to be set accordingly
  isAppLocked: true,
  showDevMode: false,
  isLockEnabled: 'false',
  isTouchIdEnabled: false,
  inRecovery: 'false',
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

  //TODO fix test
  xit('set pin should work fine', () => {
    const pin = '123456'
    const salt = 'salt'
    const gen = setPin(setPinAction(pin))
    expect(gen.next().value).toEqual(call(generateSalt))
    const hashedPin: any = gen.next(salt).value
    expect(hashedPin).toEqual(call(pinHash, pin, salt))

    gen.next(pin)
    const initializationState = VCX_INIT_SUCCESS

    const pinStorage: any = gen.next(initializationState).value
    expect(pinStorage).toEqual(call(secureSet, PIN_STORAGE_KEY, pin))

    const saltStorage: any = gen.next(salt).value
    expect(saltStorage).toEqual(call(secureSet, SALT_STORAGE_KEY, salt))

    const pinEnabled: any = gen.next(salt).value
    expect(pinEnabled).toEqual(call(safeSet, PIN_ENABLED_KEY, 'true'))

    const inRecovery: any = gen.next(salt).value
    expect(inRecovery).toEqual(call(safeSet, IN_RECOVERY, 'false'))
    const lockEnableAction: any = gen.next(pin).value
    expect(lockEnableAction['PUT'].action).toEqual(
      expect.objectContaining({
        type: LOCK_ENABLE,
      })
    )

    expect(gen.next().done).toBe(true)
  })

  //TODO fix skipped test
  xit('check pin flow should work if correct pin is passed', () => {
    const pin = '123456'
    const salt = 'salt'
    const gen = checkPin({ type: CHECK_PIN, pin })
    // move forward for ensureVcxInitSuccess
    gen.next()
    const initializationState = VCX_INIT_SUCCESS
    expect(gen.next(initializationState).value).toEqual(
      call(secureGet, SALT_STORAGE_KEY)
    )
    expect(gen.next(salt).value).toEqual(call(pinHash, pin, salt))
    expect(gen.next(pin).value).toEqual(call(secureGet, PIN_STORAGE_KEY))
    expect(gen.next(pin).value).toEqual(put(checkPinSuccess()))
    expect(gen.next(pin).value).toEqual(call(safeSet, IN_RECOVERY, 'false'))
    expect(gen.next().done).toBe(true)
  })

  //TODO fix skipped test
  xit('check pin flow should fail if incorrect pin is passed', () => {
    const pin = '123456'
    const salt = 'salt'
    const wrongPin = '123444'
    const gen = checkPin({ type: CHECK_PIN, pin })
    // move forward for ensureVcxInitSuccess
    gen.next()
    const initializationState = VCX_INIT_SUCCESS
    expect(gen.next(initializationState).value).toEqual(
      call(secureGet, SALT_STORAGE_KEY)
    )
    expect(gen.next(salt).value).toEqual(call(pinHash, pin, salt))
    expect(gen.next(pin).value).toEqual(call(secureGet, PIN_STORAGE_KEY))
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

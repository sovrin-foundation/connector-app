// @flow
import { put, call } from 'redux-saga/effects'
import type { LockStore } from '../type-lock'
import {
  SET_PIN,
  CHECK_PIN,
  CHECK_PIN_IDLE,
  LOCK_ENABLE,
  PIN_ENABLED_KEY,
  IN_RECOVERY,
  PIN_HASH,
  SALT,
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
  checkPinAction,
  setInRecovery,
} from '../lock-store'
import {
  secureSet,
  secureGet,
  safeSet,
  safeGet,
  getHydrationItem,
} from '../../services/storage'
import { generateSalt, pinHash } from '../pin-hash'
import { VCX_INIT_SUCCESS } from '../../store/type-config-store'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { configStoreHydratedInstalledVcxInitSuccess } from '../../../__mocks__/data/config-store-mock-data'

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

  it('set pin should work fine', () => {
    const pin = '123456'
    const salt = 'salt'
    const hashedPin = 'some-hash'

    return expectSaga(setPin, setPinAction(pin))
      .provide([
        [matchers.call.fn(generateSalt), salt],
        [matchers.call.fn(pinHash, pin, salt), hashedPin],
      ])
      .call(secureSet, PIN_HASH, hashedPin)
      .call(secureSet, SALT, salt)
      .call(safeSet, PIN_ENABLED_KEY, 'true')
      .call(safeSet, IN_RECOVERY, 'false')
      .put(lockEnable('true'))
      .run()
  })

  it('check pin flow should work if correct pin is passed', () => {
    const pin = '123456'
    const salt = 'salt'
    const expectedPinHash = 'expectedPinHash'

    return expectSaga(checkPin, checkPinAction(pin))
      .provide([
        [matchers.call.fn(safeGet, IN_RECOVERY), null],
        [call(getHydrationItem, SALT), salt],
        [call(getHydrationItem, PIN_HASH), expectedPinHash],
        [matchers.call.fn(pinHash, pin, salt), expectedPinHash],
      ])
      .put(checkPinSuccess())
      .run()
  })

  it('check pin flow should work if correct pin is passed in recovery', () => {
    const pin = '123456'
    const salt = 'salt'
    const expectedPinHash = 'expectedPinHash'

    return expectSaga(checkPin, checkPinAction(pin))
      .withState({ config: configStoreHydratedInstalledVcxInitSuccess })
      .provide([
        [matchers.call.fn(safeGet, IN_RECOVERY), 'true'],
        [call(getHydrationItem, SALT), salt],
        [call(getHydrationItem, PIN_HASH), expectedPinHash],
        [matchers.call.fn(pinHash, pin, salt), expectedPinHash],
      ])
      .call(safeSet, IN_RECOVERY, 'false')
      .put(setInRecovery('false'))
      .put(checkPinSuccess())
      .run()
  })

  it('check pin flow should fail if incorrect pin is passed', () => {
    const pin = '123456'
    const salt = 'salt'
    const expectedPinHash = 'expectedPinHash'
    const enteredPinHash = 'enteredPinHash'

    return expectSaga(checkPin, checkPinAction(pin))
      .provide([
        [matchers.call.fn(safeGet, IN_RECOVERY), null],
        [call(getHydrationItem, SALT), salt],
        [call(getHydrationItem, PIN_HASH), expectedPinHash],
        [matchers.call.fn(pinHash, pin, salt), enteredPinHash],
      ])
      .put(checkPinFail())
      .run()
  })

  it('should set checkPinStatus to idle', () => {
    const failedState = lockReducer(initialState, checkPinFail())
    expect(failedState).toMatchSnapshot()
    const expectedState = lockReducer(failedState, checkPinStatusIdle())
    expect(expectedState).toMatchSnapshot()
  })
})

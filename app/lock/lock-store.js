// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import {
  PENDING_REDIRECT,
  CLEAR_PENDING_REDIRECT,
  SET_PIN,
  LOCK_ENABLE,
  TOUCHID_ENABLE,
  LOCK_FAIL,
  CHECK_PIN,
  CHECK_PIN_FAIL,
  CHECK_PIN_IDLE,
  CHECK_PIN_SUCCESS,
  PIN_STORAGE_KEY,
  TOUCHID_STORAGE_KEY,
  UNLOCK_APP,
  SET_TOUCHID,
} from './type-lock'
import type {
  PendingRedirection,
  LockStore,
  AddPendingRedirectAction,
  ClearPendingRedirectAction,
  SetPinAction,
  SetTouchIdAction,
  LockEnable,
  LockFail,
  CheckPinAction,
  CheckPinFailAction,
  CheckPinSuccessAction,
  LockActions,
  UnlockAppAction,
  CheckPinIdleAction,
} from './type-lock'
import { getItem, setItem } from '../services/secure-storage'

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
  error: {
    code: null,
    message: null,
  },
}

export function addPendingRedirection(
  pendingRedirection: Array<PendingRedirection>
): AddPendingRedirectAction {
  return {
    type: PENDING_REDIRECT,
    pendingRedirection,
  }
}

export const clearPendingRedirect = (): ClearPendingRedirectAction => ({
  type: CLEAR_PENDING_REDIRECT,
})

export const setPinAction = (pin: string): SetPinAction => ({
  type: SET_PIN,
  pin,
})

export const setTouchIdAction = (
  isTouchIdEnabled: boolean
): SetTouchIdAction => ({
  type: SET_TOUCHID,
  isTouchIdEnabled,
})

export const lockEnable = (isLockEnable: boolean): LockEnable => ({
  type: LOCK_ENABLE,
  isLockEnable,
})

export const lockFail = (error: CustomError): LockFail => ({
  type: LOCK_FAIL,
  error,
})

export function* setPin(action: SetPinAction): Generator<*, *, *> {
  try {
    yield call(setItem, PIN_STORAGE_KEY, action.pin)
    yield put(lockEnable(true))
  } catch (e) {
    yield lockFail(e)
  }
}

export function* setTouchId(action: SetTouchIdAction): Generator<*, *, *> {
  try {
    yield call(setItem, TOUCHID_STORAGE_KEY, 'true')
    yield put(lockEnable(true))
  } catch (e) {
    yield lockFail(e)
  }
}

export function* watchSetPin(): Generator<*, *, *> {
  yield takeLatest(SET_PIN, setPin)
}

export const checkPinSuccess = (): CheckPinSuccessAction => ({
  type: CHECK_PIN_SUCCESS,
})

export const checkPinFail = (): CheckPinFailAction => ({
  type: CHECK_PIN_FAIL,
})

export const checkPinAction = (pin: string): CheckPinAction => ({
  type: CHECK_PIN,
  pin,
})

export function* checkPin(action: CheckPinAction): Generator<*, *, *> {
  const expectedPin = yield call(getItem, PIN_STORAGE_KEY)
  if (expectedPin === action.pin) {
    yield put(checkPinSuccess())
  } else {
    yield put(checkPinFail())
  }
}

export function* watchCheckPin(): Generator<*, *, *> {
  yield takeLatest(CHECK_PIN, checkPin)
}

export const unlockApp = (): UnlockAppAction => ({
  type: UNLOCK_APP,
})

export const checkPinStatusIdle = (): CheckPinIdleAction => ({
  type: CHECK_PIN_IDLE,
})

export function* watchLock(): Generator<*, *, *> {
  yield all([watchCheckPin(), watchSetPin()])
}

export default function lockReducer(
  state: LockStore = initialState,
  action: LockActions
): LockStore {
  switch (action.type) {
    case PENDING_REDIRECT:
      return {
        ...state,
        pendingRedirection: action.pendingRedirection,
      }
    case LOCK_ENABLE:
      return {
        ...state,
        isLockEnabled: action.isLockEnable,
      }
    case LOCK_FAIL:
      return {
        ...state,
        isLockEnabled: false,
        error: action.error,
      }
    case CLEAR_PENDING_REDIRECT:
      return {
        ...state,
        pendingRedirection: null,
      }
    case CHECK_PIN_SUCCESS:
      return {
        ...state,
        checkPinStatus: CHECK_PIN_SUCCESS,
        isAppLocked: false,
      }
    case CHECK_PIN_FAIL:
      return {
        ...state,
        checkPinStatus: CHECK_PIN_FAIL,
      }
    case CHECK_PIN_IDLE:
      return {
        ...state,
        checkPinStatus: CHECK_PIN_IDLE,
      }
    case UNLOCK_APP:
      return {
        ...state,
        isAppLocked: false,
      }
    case TOUCHID_ENABLE:
      return {
        ...state,
        isTouchIdEnabled: true,
      }
    default:
      return state
  }
}

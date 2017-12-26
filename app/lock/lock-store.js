// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import {
  PENDING_REDIRECT,
  CLEAR_PENDING_REDIRECT,
  SET_PIN,
  LOCK_ENABLE,
  LOCK_FAIL,
  CHECK_PIN,
  CHECK_PIN_FAIL,
  CHECK_PIN_IDLE,
  CHECK_PIN_SUCCESS,
  PIN_STORAGE_KEY,
  UNLOCK_APP,
  ENABLE_TOUCHID,
  DISABLE_TOUCHID,
  CHECK_TOUCHID,
  TOUCHID_STORAGE_KEY,
} from './type-lock'
import type {
  PendingRedirection,
  LockStore,
  AddPendingRedirectAction,
  ClearPendingRedirectAction,
  SetPinAction,
  LockEnable,
  LockFail,
  CheckPinAction,
  CheckPinFailAction,
  CheckPinSuccessAction,
  LockActions,
  UnlockAppAction,
  CheckPinIdleAction,
  CheckTouchIdAction,
  EnableTouchIdAction,
  DisableTouchIdAction,
} from './type-lock'
import { getItem, setItem, deleteItem } from '../services/secure-storage'

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

export const enableTouchIdAction = (): EnableTouchIdAction => ({
  type: ENABLE_TOUCHID,
})
export const disableTouchIdAction = (): DisableTouchIdAction => ({
  type: DISABLE_TOUCHID,
})

export function* enableTouchId(
  action: EnableTouchIdAction
): Generator<*, *, *> {
  try {
    yield call(setItem, TOUCHID_STORAGE_KEY, 'true')
  } catch (e) {
    yield e
  }
}
export function* disableTouchId(
  action: DisableTouchIdAction
): Generator<*, *, *> {
  try {
    yield call(setItem, TOUCHID_STORAGE_KEY, 'false')
  } catch (e) {
    yield e
  }
}

export function* watchEnableTouchId(): Generator<*, *, *> {
  yield takeLatest(ENABLE_TOUCHID, enableTouchId)
}
export function* watchDisableTouchId(): Generator<*, *, *> {
  yield takeLatest(DISABLE_TOUCHID, disableTouchId)
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

export const checkTouchIdAction = (
  isTouchIdEnabled: boolean
): CheckTouchIdAction => ({
  type: CHECK_TOUCHID,
  isTouchIdEnabled,
})

export function* checkTouchId(action: CheckTouchIdAction): Generator<*, *, *> {
  const isTouchIdEnabled = yield call(getItem, TOUCHID_STORAGE_KEY)
  if (isTouchIdEnabled === true) {
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
  yield all([
    watchCheckPin(),
    watchSetPin(),
    watchEnableTouchId(),
    watchEnableTouchId(),
  ])
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
    case ENABLE_TOUCHID:
      return {
        ...state,
        isTouchIdEnabled: true,
      }
    case DISABLE_TOUCHID:
      return {
        ...state,
        isTouchIdEnabled: false,
      }
    case CHECK_TOUCHID:
      return {
        ...state,
        isTouchIdEnabled: action.isTouchIdEnabled,
      }
    default:
      return state
  }
}

// @flow
import { put, takeLatest, take, select, call, all } from 'redux-saga/effects'
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
  LONG_PRESSED_IN_LOCK_SELECTION_SCREEN,
  PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN,
  RESET_TOUCH_EVENT_VARIABLES,
  SHOW_DEV_MODE,
  HIDE_DEV_MODE,
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
  LongPressedInLockSelectionScreen,
  PressedOnOrInLockSelectionScreen,
  ResetTouchEventVariables,
  EnableDevMode,
  DisableDevMode,
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
  showDevMode: false,
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
    yield put(lockFail(e))
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

export function* watchEnableTouchId(): any {
  yield takeLatest(ENABLE_TOUCHID, enableTouchId)
}
export function* watchDisableTouchId(): any {
  yield takeLatest(DISABLE_TOUCHID, disableTouchId)
}

export function* watchSetPin(): any {
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

export const enableDevMode = (): EnableDevMode => ({
  type: SHOW_DEV_MODE,
})
export const disableDevMode = (): DisableDevMode => ({
  type: HIDE_DEV_MODE,
})

export function* checkPin(action: CheckPinAction): Generator<*, *, *> {
  const expectedPin = yield call(getItem, PIN_STORAGE_KEY)
  if (expectedPin === action.pin) {
    yield put(checkPinSuccess())
  } else {
    yield put(checkPinFail())
  }
}

export const longPressedInLockSelectionScreen = (): LongPressedInLockSelectionScreen => ({
  type: LONG_PRESSED_IN_LOCK_SELECTION_SCREEN,
})

export const pressedOnOrInLockSelectionScreen = (): PressedOnOrInLockSelectionScreen => ({
  type: PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN,
})

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

export function* watchCheckPin(): any {
  yield takeLatest(CHECK_PIN, checkPin)
}

export function* watchPressEventInLockSelectionScreen(): Generator<*, *, *> {
  while (true) {
    yield take('LONG_PRESSED_IN_LOCK_SELECTION_SCREEN')
    for (var i = 1; i <= 10; i++) {
      yield take('PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN')
    }
    yield put(enableDevMode())
  }
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
    watchDisableTouchId(),
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
    case SHOW_DEV_MODE:
      return {
        ...state,
        showDevMode: true,
      }
    case HIDE_DEV_MODE:
      return {
        ...state,
        showDevMode: false,
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

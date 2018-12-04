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
  UNLOCK_APP,
  LONG_PRESSED_IN_LOCK_SELECTION_SCREEN,
  PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN,
  RESET_TOUCH_EVENT_VARIABLES,
  SHOW_DEV_MODE,
  HIDE_DEV_MODE,
  ENABLE_TOUCHID,
  DISABLE_TOUCHID,
  CHECK_TOUCHID,
  TOUCH_ID_STORAGE_KEY,
  PIN_ENABLED_KEY,
  IN_RECOVERY,
  PIN_HASH,
  SALT,
} from './type-lock'
import type {
  PendingRedirection,
  LockStore,
  AddPendingRedirectAction,
  ClearPendingRedirectAction,
  SetPinAction,
  LockEnable,
  InRecovery,
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
import {
  walletGet,
  walletSet,
  secureSet,
  secureGet,
  safeGet,
  safeSet,
  getHydrationItem,
} from '../services/storage'
import { pinHash, generateSalt } from './pin-hash'
import { Platform } from 'react-native'
import { getVcxInitializationState } from '../store/store-selector'
import { ensureVcxInitSuccess } from '../store/config-store'
import { captureError } from '../services/error/error-handler'

const initialState: LockStore = {
  pendingRedirection: null,
  checkPinStatus: CHECK_PIN_IDLE,
  // we are assuming that app will be locked by default
  // and it will be unlocked either when user set security first time
  // or user unlock the app every time user opens the app
  // this property needs to be set accordingly
  isAppLocked: true,
  isLockEnabled: 'false',
  inRecovery: 'false',
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

export const lockEnable = (isLockEnable: string): LockEnable => ({
  type: LOCK_ENABLE,
  isLockEnable,
})

export const setInRecovery = (inRecovery: string): InRecovery => ({
  type: IN_RECOVERY,
  inRecovery,
})

export const lockFail = (error: CustomError): LockFail => ({
  type: LOCK_FAIL,
  error,
})

export function* setPin(action: SetPinAction): Generator<*, *, *> {
  try {
    const salt: string = yield call(generateSalt)
    const hashedPin: string = yield call(pinHash, action.pin.toString(), salt)
    yield call(secureSet, PIN_HASH, hashedPin)
    yield call(secureSet, SALT, salt)
    yield call(safeSet, PIN_ENABLED_KEY, 'true')
    yield call(safeSet, IN_RECOVERY, 'false')
    yield put(lockEnable('true'))
  } catch (e) {
    captureError(e)
    yield put(lockFail(e))
  }
}

export const enableTouchIdAction = () => ({
  type: ENABLE_TOUCHID,
})
export const disableTouchIdAction = (): DisableTouchIdAction => ({
  type: DISABLE_TOUCHID,
})

export function* enableTouchId(
  action: EnableTouchIdAction
): Generator<*, *, *> {
  try {
    yield call(safeSet, TOUCH_ID_STORAGE_KEY, 'true')
  } catch (e) {
    yield e
  }
}

export function* disableTouchId(
  action: DisableTouchIdAction
): Generator<*, *, *> {
  try {
    yield call(safeSet, TOUCH_ID_STORAGE_KEY, 'false')
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
  const inRecovery: string | null = yield call(safeGet, IN_RECOVERY)

  if (inRecovery === 'true') {
    const vcxResult = yield* ensureVcxInitSuccess()
    if (vcxResult && vcxResult.fail) {
      return
    }
  }
  const salt: string = yield call(getHydrationItem, SALT)
  const expectedPinHash: string = yield call(getHydrationItem, PIN_HASH)
  const enteredPinHash: string = yield call(pinHash, action.pin, salt)

  if (expectedPinHash === enteredPinHash) {
    yield put(checkPinSuccess())
    if (inRecovery == 'true') {
      yield call(safeSet, IN_RECOVERY, 'false')
      yield put(setInRecovery('false'))
    }
  } else {
    captureError(new Error('Check pin fail'))
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
  const isTouchIdEnabled = yield call(safeGet, TOUCH_ID_STORAGE_KEY)
  if (isTouchIdEnabled === true) {
    yield put(checkPinSuccess())
  } else {
    yield put(checkPinFail())
  }
}

export function* watchCheckPin(): any {
  yield takeLatest(CHECK_PIN, checkPin)
}

export function* watchPressEventInLockSelectionScreen(): any {
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

export function* watchLock(): any {
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
    case IN_RECOVERY:
      return {
        ...state,
        inRecovery: action.inRecovery,
      }
    case LOCK_FAIL:
      return {
        ...state,
        isLockEnabled: 'false',
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

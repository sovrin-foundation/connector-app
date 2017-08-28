// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import {
  PENDING_REDIRECT,
  CLEAR_PENDING_REDIRECT,
  SET_PIN,
  CHECK_PIN,
  CHECK_PIN_FAIL,
  CHECK_PIN_IDLE,
  CHECK_PIN_SUCCESS,
  PIN_STORAGE_KEY,
  UNLOCK_APP,
} from './type-lock'
import type {
  LockStore,
  AddPendingRedirectAction,
  ClearPendingRedirectAction,
  SetPinAction,
  CheckPinAction,
  CheckPinFailAction,
  CheckPinSuccessAction,
  LockActions,
  UnlockAppAction,
} from './type-lock'
import { getItem, setItem } from '../services'

const initialState: LockStore = {
  pendingRedirection: null,
  checkPinStatus: CHECK_PIN_IDLE,
  // we are assuming that app will be locked by default
  // and it will be unlocked either when user set security first time
  // or user unlock the app every time user opens the app
  // this property needs to be set accordingly
  isAppLocked: true,
}

export function addPendingRedirection(
  routeName: string
): AddPendingRedirectAction {
  return {
    type: PENDING_REDIRECT,
    routeName,
  }
}

export const clearPendingRedirect = (): ClearPendingRedirectAction => ({
  type: CLEAR_PENDING_REDIRECT,
})

export const setPinAction = (pin: string): SetPinAction => ({
  type: SET_PIN,
  pin,
})

export function* setPin(action: SetPinAction): Generator<*, *, *> {
  // TODO: Add check for failure and update store accordingly
  yield call(setItem, PIN_STORAGE_KEY, action.pin)
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
        pendingRedirection: action.routeName,
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
    case UNLOCK_APP:
      return {
        ...state,
        isAppLocked: false,
      }
    default:
      return state
  }
}

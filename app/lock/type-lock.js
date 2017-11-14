// @flow
import type { CustomError, ReactNavigation } from '../common/type-common'
import { SWITCH_ERROR_ALERTS } from '../store/config-store'

export const LOCK_TYPE = {
  FINGERPRINT: 'FINGERPRINT',
  PIN: 'PIN',
}
export type lockType = $Keys<typeof LOCK_TYPE>

export type PendingRedirection = {
  routeName: string,
  params?: ?{ [string]: any },
}

export const PENDING_REDIRECT = 'SET_PENDING_REDIRECT'
export type AddPendingRedirectAction = {
  type: typeof PENDING_REDIRECT,
  pendingRedirection: Array<PendingRedirection>,
}

export const CLEAR_PENDING_REDIRECT = 'CLEAR_PENDING_REDIRECT'
export type ClearPendingRedirectAction = {
  type: typeof CLEAR_PENDING_REDIRECT,
}

export const PIN_STORAGE_KEY = 'APP_PIN_LOCK'
export const SET_PIN = 'SET_PIN'
export type SetPinAction = {
  type: typeof SET_PIN,
  pin: string,
}

export const LOCK_ENABLE = 'LOCK_ENABLE'
export type LockEnable = {
  type: typeof LOCK_ENABLE,
  isLockEnable: boolean,
}

export const LOCK_FAIL = 'LOCK_FAIL'
export type LockFail = {
  type: typeof LOCK_FAIL,
  error: CustomError,
}

export const CHECK_PIN = 'CHECK_PIN'
export type CheckPinAction = {
  type: typeof CHECK_PIN,
  pin: string,
}

export const CHECK_PIN_SUCCESS = 'CHECK_PIN_SUCCESS'
export type CheckPinSuccessAction = {
  type: typeof CHECK_PIN_SUCCESS,
}

export const CHECK_PIN_FAIL = 'CHECK_PIN_FAIL'
export type CheckPinFailAction = {
  type: typeof CHECK_PIN_FAIL,
}

export const CHECK_PIN_IDLE = 'CHECK_PIN_IDLE'
export type CheckPinIdleAction = {
  type: typeof CHECK_PIN_IDLE,
}

export const UNLOCK_APP = 'UNLOCK_APP'
export type UnlockAppAction = {
  type: typeof UNLOCK_APP,
}

export type SwitchErrorAlerts = {
  type: typeof SWITCH_ERROR_ALERTS,
}

export type CheckPinStatus =
  | typeof CHECK_PIN_SUCCESS
  | typeof CHECK_PIN_FAIL
  | typeof CHECK_PIN_IDLE

export type LockStore = {
  pendingRedirection: ?Array<PendingRedirection>,
  checkPinStatus: CheckPinStatus,
  isAppLocked: boolean,
  isLockEnabled: boolean,
}

export type LockActions =
  | AddPendingRedirectAction
  | ClearPendingRedirectAction
  | SetPinAction
  | CheckPinAction
  | CheckPinSuccessAction
  | CheckPinFailAction
  | SwitchErrorAlerts

export type LockEnterPinProps = {
  checkPinAction: (pin: string) => CheckPinAction,
  checkPinStatusIdle: () => CheckPinIdleAction,
  checkPinStatus: CheckPinStatus,
  pendingRedirection: Array<PendingRedirection>,
  switchErrorAlerts: () => SwitchErrorAlerts,
  clearPendingRedirect: () => void,
} & ReactNavigation

export type LockEnterPinState = {
  interactionsDone: boolean,
}

export const PIN_SETUP_STATE = {
  INITIAL: 'INITIAL',
  REENTER: 'REENTER',
  REENTER_FAIL: 'REENTER_FAIL',
  REENTER_SUCCESS: 'REENTER_SUCCESS',
}

export type LockPinSetupState = {
  pinSetupState: $Keys<typeof PIN_SETUP_STATE>,
  interactionsDone: boolean,
  enteredPin: ?string,
}

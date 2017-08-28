// @flow
// TODO:KS Move this type to common app types
import type {
  ReactNavigation,
} from '../qr-connection-request/type-qr-connection-request'
export const LOCK_TYPE = {
  FINGERPRINT: 'FINGERPRINT',
  PIN: 'PIN',
}

export type lockType = $Keys<typeof LOCK_TYPE>

export const PENDING_REDIRECT = 'SET_PENDING_REDIRECT'
export type AddPendingRedirectAction = {
  type: typeof PENDING_REDIRECT,
  routeName: string,
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

export const UNLOCK_APP = 'UNLOCK_APP'
export type UnlockAppAction = {
  type: typeof UNLOCK_APP,
}

export type CheckPinStatus =
  | typeof CHECK_PIN_SUCCESS
  | typeof CHECK_PIN_FAIL
  | typeof CHECK_PIN_IDLE

export type LockStore = {
  pendingRedirection: ?string,
  checkPinStatus: CheckPinStatus,
  isAppLocked: boolean,
}

export type LockActions =
  | AddPendingRedirectAction
  | ClearPendingRedirectAction
  | SetPinAction
  | CheckPinAction
  | CheckPinSuccessAction
  | CheckPinFailAction

export type LockEnterPinProps = {
  checkPinAction: (pin: string) => CheckPinAction,
  checkPinStatus: CheckPinStatus,
  pendingRedirection: string,
} & ReactNavigation

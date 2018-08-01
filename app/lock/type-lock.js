// @flow
import type { CustomError, ReactNavigation } from '../common/type-common'
import { SWITCH_ERROR_ALERTS } from '../store/type-config-store'

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

export const PIN_HASH = 'PIN_HASH'
export const SALT = 'SALT'
export const PIN_STORAGE_KEY = 'APP_PIN_LOCK'
export const PIN_ENABLED_KEY = 'APP_PIN_LOCK_ENABLED'
export const IN_RECOVERY = 'IN_RECOVERY'
export type InRecovery = {
  type: typeof IN_RECOVERY,
  inRecovery: string,
}
export const SALT_STORAGE_KEY = 'APP_PIN_SALT'
export const SET_PIN = 'SET_PIN'
export type SetPinAction = {
  type: typeof SET_PIN,
  pin: string,
}

export const TOUCH_ID_STORAGE_KEY = 'APP_TOUCHID_LOCK'
export const ENABLE_TOUCHID = 'ENABLE_TOUCHID'
export type EnableTouchIdAction = {
  type: typeof ENABLE_TOUCHID,
}
export const DISABLE_TOUCHID = 'DISABLE_TOUCHID'
export type DisableTouchIdAction = {
  type: typeof DISABLE_TOUCHID,
}

export const CHECK_TOUCHID = 'CHECK_TOUCHID'
export type CheckTouchIdAction = {
  type: typeof CHECK_TOUCHID,
  isTouchIdEnabled: boolean,
}

export const LOCK_ENABLE = 'LOCK_ENABLE'
export type LockEnable = {
  type: typeof LOCK_ENABLE,
  isLockEnable: string,
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

export const PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN =
  'PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN'
export type PressedOnOrInLockSelectionScreen = {
  type: typeof PRESSED_ON_OR_IN_LOCK_SELECTION_SCREEN,
}

export const LONG_PRESSED_IN_LOCK_SELECTION_SCREEN =
  'LONG_PRESSED_IN_LOCK_SELECTION_SCREEN'
export type LongPressedInLockSelectionScreen = {
  type: typeof LONG_PRESSED_IN_LOCK_SELECTION_SCREEN,
}

export const RESET_TOUCH_EVENT_VARIABLES = 'RESET_TOUCH_EVENT_VARIABLES'
export type ResetTouchEventVariables = {
  type: typeof RESET_TOUCH_EVENT_VARIABLES,
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
  isLockEnabled: string,
  isTouchIdEnabled: boolean,
  showDevMode: boolean,
  inRecovery: string,
}

export type LockSelectionProps = {
  showDevMode: boolean,
  disableDevMode: () => DisableDevMode,
  longPressedInLockSelectionScreen: () => void,
  pressedOnOrInLockSelectionScreen: () => void,
  switchErrorAlerts: () => void,
  safeToDownloadSmsInvitation: () => void,
} & ReactNavigation

export type LockActions =
  | AddPendingRedirectAction
  | ClearPendingRedirectAction
  | SetPinAction
  | EnableTouchIdAction
  | DisableTouchIdAction
  | CheckTouchIdAction
  | CheckPinAction
  | CheckPinSuccessAction
  | CheckPinFailAction
  | SwitchErrorAlerts

export type LockEnterPinProps = {
  pendingRedirection: Array<PendingRedirection>,
  isFetchingInvitation?: boolean,
  clearPendingRedirect: () => void,
  unlockApp: () => void,
  existingPin: boolean,
  isAppLocked: boolean,
  inRecovery: string,
} & ReactNavigation

export type LockEnterFingerProps = {
  pendingRedirection: Array<PendingRedirection>,
  isFetchingInvitation?: boolean,
  clearPendingRedirect: () => void,
  unlockApp: () => void,
  isAppLocked: boolean,
} & ReactNavigation

export type LockEnterPinState = {
  authenticationSuccess: boolean,
}
export type LockEnterFingerState = {
  authenticationSuccess: boolean,
}
export type LockEnterState = {
  interactionsDone: boolean,
}

export const PIN_SETUP_STATE = {
  INITIAL: 'INITIAL',
  REENTER: 'REENTER',
  REENTER_FAIL: 'REENTER_FAIL',
  REENTER_SUCCESS: 'REENTER_SUCCESS',
  ENTER_NEW_PIN: 'ENTER_NEW_PIN',
}

export type LockPinSetupState = {
  pinSetupState: $Keys<typeof PIN_SETUP_STATE>,
  interactionsDone: boolean,
  enteredPin: ?string,
}

export const SHOW_DEV_MODE = 'SHOW_DEV_MODE'
export type EnableDevMode = {
  type: typeof SHOW_DEV_MODE,
}

export const HIDE_DEV_MODE = 'HIDE_DEV_MODE'
export type DisableDevMode = {
  type: typeof HIDE_DEV_MODE,
}

export type LockEnterProps = {
  checkPinAction: (pin: string) => void,
  checkPinStatusIdle: () => void,
  switchErrorAlerts: () => void,
  onSuccess: () => void,
  message?: string,
  checkPinStatus: CheckPinStatus,
  fromRecovery: boolean,
  setupNewPassCode?: () => void,
}

export type LockAuthorizationProps = {
  onSuccess: () => void,
  onFail: () => void,
} & ReactNavigation

export type LockFingerprintSetupProps = {
  touchIdActive: boolean,
  fromSettings: boolean,
  disableTouchIdAction: () => void,
  enableTouchIdAction: () => void,
} & ReactNavigation

export type LockPinCodeSetupProps = {
  setPinAction: (pin: string) => void,
  enableTouchIdAction: () => void,
  lockEnable: (enableLock: string) => void,
} & ReactNavigation

export type LockSetupSuccessProps = {
  pendingRedirection: Array<PendingRedirection>,
  unlockApp: () => void,
  clearPendingRedirect: () => void,
  isFetchingInvitation: boolean,
} & ReactNavigation

export const LAErrorAuthenticationFailed = 'LAErrorAuthenticationFailed'
export const LAErrorUserCancel = 'LAErrorUserCancel'
export const LAErrorUserFallback = 'LAErrorUserFallback'
export const LAErrorSystemCancel = 'LAErrorSystemCancel'
export const LAErrorPasscodeNotSet = 'LAErrorPasscodeNotSet'
export const LAErrorTouchIDNotAvailable = 'LAErrorTouchIDNotAvailable'
export const LAErrorTouchIDNotEnrolled = 'LAErrorTouchIDNotEnrolled'
export const LAErrorTouchIDUnknownError = 'RCTTouchIDUnknownError'
export const LAErrorTouchIDNotSupported = 'RCTTouchIDNotSupported'
export const TouchIDError = 'Touch ID Error'

export const AllowedFallbackToucheIDErrors = [
  LAErrorUserCancel,
  LAErrorSystemCancel,
  LAErrorPasscodeNotSet,
  LAErrorTouchIDNotAvailable,
  LAErrorTouchIDNotEnrolled,
  LAErrorTouchIDUnknownError,
  LAErrorAuthenticationFailed,
  LAErrorUserFallback,
  LAErrorTouchIDNotSupported,
  TouchIDError,
]

// @flow
/**
 * this contains configuration which is changed only from user action
 * this store should not contain any configuration
 * which are not result of user action
 */

import { AsyncStorage } from 'react-native'
import { put, take, race, all, call, select } from 'redux-saga/effects'
import { IS_ALREADY_INSTALLED } from '../common'
import { hydrateApp } from '../store/hydration-store'
import { setItem, getItem, deleteItem } from '../services/secure-storage'
import { captureError } from '../services/error/error-handler'
import { lockEnable } from '../lock/lock-store'
import { PIN_STORAGE_KEY, TOUCHID_STORAGE_KEY } from '../lock/type-lock'
import { getErrorAlertsSwitchValue } from '../store/store-selector'
import { enableTouchIdAction, disableTouchIdAction } from '../lock/lock-store'
import {
  SERVER_ENVIRONMENT,
  HYDRATED,
  APP_INSTALLED,
  ALREADY_INSTALLED_RESULT,
  SERVER_ENVIRONMENT_CHANGED,
  SERVER_ENVIRONMENT_CHANGED_DEMO,
  SERVER_ENVIRONMENT_CHANGED_SANDBOX,
  SWITCH_ERROR_ALERTS,
  TOGGLE_ERROR_ALERTS,
  SWITCH_ENVIRONMENT,
} from './type-config-store'
import type {
  ServerEnvironment,
  ConfigStore,
  ConfigAction,
  ServerEnvironmentChangedAction,
} from './type-config-store'
import { appHydration } from './hydration-store'

export const baseUrls = {
  [SERVER_ENVIRONMENT.SANDBOX]: {
    agencyUrl: 'https://cagency.pdev.evernym.com',
  },
  [SERVER_ENVIRONMENT.DEMO]: {
    agencyUrl: 'https://agency-sandbox.evernym.com',
  },
}

const initialState: ConfigStore = {
  ...baseUrls[SERVER_ENVIRONMENT.SANDBOX],
  isAlreadyInstalled: false,
  // this flag is used to identify if we got the already stored data
  // from the phone and loaded in app
  isHydrated: false,
  // configurable error alert messages
  showErrorAlerts: false,
  // TODO:KS Need to add one more property to check if app lock is set
  // and then save that property once lock setup is success
  // and get in hydrateConfig saga, then check this value in splashscreen
  // it will help in case user has not completed pin setup
  // and kills the app for first time
  // next time user opens the app, he won't be asked to setup pin
  agencyDID: 'U5okhuLX1vtfPfpEh1W2GR',
  agencyVerificationKey: 'Fm9H5zDJpLtWTFa3YtxpnRThrzr5dT7sPtq15mJ4bhin',
  poolConfig: null,
}
export const hydrated = () => ({
  type: HYDRATED,
})

export const alreadyInstalledAction = (isAlreadyInstalled: boolean) => ({
  type: ALREADY_INSTALLED_RESULT,
  isAlreadyInstalled,
})

export const appInstalledSuccess = () => ({
  type: APP_INSTALLED,
})

export const changeServerEnvironmentToDemo = () => ({
  type: SERVER_ENVIRONMENT_CHANGED_DEMO,
})

export const changeServerEnvironmentToSandbox = () => ({
  type: SERVER_ENVIRONMENT_CHANGED_SANDBOX,
})
export const changeEnvironment = (
  agencyUrl: string,
  agencyDID: string,
  agencyVerificationKey: string,
  poolConfig: string
) => ({
  type: SWITCH_ENVIRONMENT,
  poolConfig,
  agencyDID,
  agencyVerificationKey,
  agencyUrl,
})

export const changeServerEnvironment = (
  serverEnvironment: ServerEnvironment
): ServerEnvironmentChangedAction => ({
  type: SERVER_ENVIRONMENT_CHANGED,
  serverEnvironment,
})

export const switchErrorAlerts = () => ({
  type: SWITCH_ERROR_ALERTS,
})

export const toggleErrorAlerts = (isShowErrorAlert: boolean) => ({
  type: TOGGLE_ERROR_ALERTS,
  isShowErrorAlert,
})

export function* watchChangeEnvironmentToDemo(): Generator<*, *, *> {
  while (true) {
    for (let i = 0; i < 4; i++) {
      yield take(SERVER_ENVIRONMENT_CHANGED_DEMO)
    }

    yield put(changeServerEnvironment(SERVER_ENVIRONMENT.DEMO))
  }
}

export function* watchChangeEnvironmentToSandbox(): Generator<*, *, *> {
  while (true) {
    for (let i = 0; i < 4; i++) {
      yield take(SERVER_ENVIRONMENT_CHANGED_SANDBOX)
    }

    yield put(changeServerEnvironment(SERVER_ENVIRONMENT.SANDBOX))
  }
}

export function* watchSwitchErrorAlerts(): Generator<*, *, *> {
  while (true) {
    for (let i = 0; i < 4; i++) {
      yield take(SWITCH_ERROR_ALERTS)
    }

    const switchValue = yield select(getErrorAlertsSwitchValue)
    yield put(toggleErrorAlerts(!switchValue))
  }
}

export function* alreadyInstalledNotFound(): Generator<*, *, *> {
  yield put(alreadyInstalledAction(false))

  // clear security setup flag
  yield call(deleteItem, PIN_STORAGE_KEY)
  yield call(deleteItem, TOUCHID_STORAGE_KEY)
  yield put(lockEnable(false))

  // now save the key in user's default storage in phone
  try {
    yield call(AsyncStorage.setItem, IS_ALREADY_INSTALLED, 'true')
  } catch (e) {
    // somehow the storage failed, so we need to find someway to store
    // maybe we fallback to file based storage

    // Capture AsyncStorage failed
    captureError(e)
  }
}

export function* hydrateConfig(): Generator<*, *, *> {
  let isAlreadyInstalled = false
  try {
    isAlreadyInstalled = yield call(AsyncStorage.getItem, IS_ALREADY_INSTALLED)
    if (isAlreadyInstalled) {
      yield put(alreadyInstalledAction(true))
      try {
        // restore app lock settings
        const isLockEnabled = yield call(getItem, PIN_STORAGE_KEY)
        if (isLockEnabled) {
          yield put(lockEnable(true))
        }
        const isTouchIdEnabled = yield call(getItem, TOUCHID_STORAGE_KEY)
        if (isTouchIdEnabled === 'true') {
          yield put(enableTouchIdAction())
        } else {
          yield put(disableTouchIdAction())
        }
      } catch (e) {
        // somehow the secure storage failed, so we need to find someway to store
        // maybe we fallback to file based storage

        // Capture AsyncStorage failed
        captureError(e)
      }
    } else {
      // if the value we got for isAlreadyInstalled as null
      yield* alreadyInstalledNotFound()
    }
  } catch (e) {
    // if we did not find any value in user default storage
    // it means that user uninstalled the app and is now trying again
    // or this is a new installation
    yield* alreadyInstalledNotFound()
  }

  // hydrating connections and push token
  yield put(hydrateApp(isAlreadyInstalled))
  yield* appHydration({ isAlreadyInstalled })
  yield put(hydrated())
}

export function* watchConfig(): Generator<*, *, *> {
  yield all([
    watchChangeEnvironmentToDemo(),
    watchChangeEnvironmentToSandbox(),
    watchSwitchErrorAlerts(),
    hydrateConfig(),
  ])
}

export default function configReducer(
  state: ConfigStore = initialState,
  action: ConfigAction
) {
  switch (action.type) {
    case SERVER_ENVIRONMENT_CHANGED:
      const urls = baseUrls[action.serverEnvironment]
      return {
        ...state,
        ...urls,
      }
    case ALREADY_INSTALLED_RESULT:
      return {
        ...state,
        isAlreadyInstalled: action.isAlreadyInstalled,
      }
    case HYDRATED:
      return {
        ...state,
        isHydrated: true,
      }
    case APP_INSTALLED:
      return {
        ...state,
        isAlreadyInstalled: true,
      }
    case TOGGLE_ERROR_ALERTS:
      return {
        ...state,
        showErrorAlerts: action.isShowErrorAlert,
      }
    case SWITCH_ENVIRONMENT:
      return {
        ...state,
        poolConfig: action.poolConfig,
        agencyDID: action.agencyDID,
        agencyVerificationKey: action.agencyVerificationKey,
        agencyUrl: action.agencyUrl,
      }
    default:
      return state
  }
}

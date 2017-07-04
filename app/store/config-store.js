/**
 * this contains configuration which is changed only from user action
 * this store should not contain any configuration
 * which are not result of user action
 */

import { AsyncStorage } from 'react-native'
import { put, take, all, call } from 'redux-saga/effects'
import { IS_ALREADY_INSTALLED } from '../common/secure-storage-constants'

export const SERVER_ENVIRONMENT = {
  DEMO: 'DEMO',
  SANDBOX: 'SANDBOX',
}

export const baseUrls = {
  [SERVER_ENVIRONMENT.SANDBOX]: {
    agencyUrl: 'http://34.210.167.140',
    callCenterUrl: 'http://35.166.201.131',
  },
  [SERVER_ENVIRONMENT.DEMO]: {
    agencyUrl: 'https://agency.evernym.com',
    callCenterUrl: 'https://cua.culedger.com',
  },
}

const initialState = {
  ...baseUrls[SERVER_ENVIRONMENT.SANDBOX],
  isAlreadyInstalled: false,
  // this flag is used to identify if we got the already stored data
  // from the phone and loaded in app
  isHydrated: false,
}

export const APP_INSTALLED = 'APP_INSTALLED'
export const HYDRATED = 'HYDRATED'
export const ALREADY_INSTALLED_RESULT = 'ALREADY_INSTALLED_RESULT'
export const SERVER_ENVIRONMENT_CHANGED = 'SERVER_ENVIRONMENT_CHANGED'
export const SERVER_ENVIRONMENT_CHANGED_DEMO = 'SERVER_ENVIRONMENT_CHANGED_DEMO'
export const SERVER_ENVIRONMENT_CHANGED_SANDBOX =
  'SERVER_ENVIRONMENT_CHANGED_SANDBOX'

export const hydrated = () => ({
  type: HYDRATED,
})

export const alreadyInstalledAction = isAlreadyInstalled => ({
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

export const changeServerEnvironment = serverEnvironment => ({
  type: SERVER_ENVIRONMENT_CHANGED,
  serverEnvironment,
})

export function* watchChangeEnvironmentToDemo() {
  while (true) {
    for (let i = 0; i < 4; i++) {
      yield take(SERVER_ENVIRONMENT_CHANGED_DEMO)
    }

    yield put(changeServerEnvironment(SERVER_ENVIRONMENT.DEMO))
  }
}

export function* watchChangeEnvironmentToSandbox() {
  while (true) {
    for (let i = 0; i < 4; i++) {
      yield take(SERVER_ENVIRONMENT_CHANGED_SANDBOX)
    }

    yield put(changeServerEnvironment(SERVER_ENVIRONMENT.SANDBOX))
  }
}

export function* alreadyInstalledNotFound() {
  yield put(alreadyInstalledAction(false))

  // now save the key in user's default storage in phone
  try {
    yield call(AsyncStorage.setItem, IS_ALREADY_INSTALLED, 'true')
  } catch (e) {
    // somehow the storage failed, so we need to find someway to store
    // maybe we fallback to file based storage
  }
}

export function* hydrateConfig() {
  try {
    const isAlreadyInstalled = yield call(
      AsyncStorage.getItem,
      IS_ALREADY_INSTALLED
    )
    if (isAlreadyInstalled) {
      yield put(alreadyInstalledAction(true))
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

  yield put(hydrated())
}

export function* watchConfig() {
  yield all([
    watchChangeEnvironmentToDemo(),
    watchChangeEnvironmentToSandbox(),
    hydrateConfig(),
  ])
}

export default function configReducer(state = initialState, action) {
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
    default:
      return state
  }
}

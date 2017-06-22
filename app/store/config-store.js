/**
 * this contains configuration which is changed only from user action
 * this store should not contain any configuration
 * which are not result of user action
 */

import { put, take, all } from 'redux-saga/effects'

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
}

export const SERVER_ENVIRONMENT_CHANGED = 'SERVER_ENVIRONMENT_CHANGED'
export const SERVER_ENVIRONMENT_CHANGED_DEMO = 'SERVER_ENVIRONMENT_CHANGED_DEMO'
export const SERVER_ENVIRONMENT_CHANGED_SANDBOX =
  'SERVER_ENVIRONMENT_CHANGED_SANDBOX'

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

export function* watchConfig() {
  yield all([watchChangeEnvironmentToDemo(), watchChangeEnvironmentToSandbox()])
}

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

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case SERVER_ENVIRONMENT_CHANGED:
      const urls = baseUrls[action.serverEnvironment]
      return {
        ...state,
        ...urls,
      }
    default:
      return state
  }
}

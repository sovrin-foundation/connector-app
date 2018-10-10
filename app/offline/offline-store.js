// @flow
import { takeLatest, all, call } from 'redux-saga/effects'
import { OFFLINE_STATUS } from './type-offline'
import type {
  OfflineStatus,
  OfflineStore,
  OfflineActions,
} from './type-offline'
import { captureError } from '../services/error/error-handler'
import { ensureVcxInitSuccess } from '../store/config-store'

const initialState: OfflineStore = {
  offline: false,
}

export const offline = (offline: boolean): OfflineStatus => ({
  type: OFFLINE_STATUS,
  offline,
})

export function* watchOffline(): any {
  yield all([watchOfflineStatus()])
}

export function* watchOfflineStatus(): any {
  yield takeLatest(OFFLINE_STATUS, offlineSaga)
}

export function* offlineSaga(action: OfflineStatus): Generator<*, *, *> {
  try {
    const { offline } = action

    if (!offline) {
      yield call(ensureVcxInitSuccess)
    }
  } catch (e) {
    captureError(e)
    console.error(`offlineSaga: ${e}`)
  }
}

export default function offlineReducer(
  state: OfflineStore = initialState,
  action: OfflineActions
): OfflineStore {
  switch (action.type) {
    case OFFLINE_STATUS:
      return {
        offline: action.offline,
      }
    default:
      return state
  }
}

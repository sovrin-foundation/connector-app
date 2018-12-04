// @flow
import { takeLatest, all, call, select, take } from 'redux-saga/effects'
import { OFFLINE_STATUS } from './type-offline'
import type {
  OfflineStatus,
  OfflineStore,
  OfflineActions,
} from './type-offline'
import { captureError } from '../services/error/error-handler'
import { ensureVcxInitSuccess } from '../store/config-store'
import { VCX_INIT_FAIL } from '../store/type-config-store'
import { getOfflineStatus } from '../store/store-selector'

const initialState: OfflineStore = {
  offline: false,
}

export const offline = (offline: boolean): OfflineStatus => ({
  type: OFFLINE_STATUS,
  offline,
})

export function* watchOffline(): any {
  yield all([watchVcxInitFail()])
}

export function* watchVcxInitFail(): any {
  yield takeLatest(VCX_INIT_FAIL, vcxFailedOfflineSaga)
}

export function* vcxFailedOfflineSaga(): Generator<*, *, *> {
  try {
    const offline: boolean = yield select(getOfflineStatus)
    if (offline) {
      // since vcx failed, we want to know if vcx failed while app is offline
      // if app is in offline mode, only then we want to execute this saga

      while (true) {
        // if app was offline, now we wait for offline status to change
        const offlineAction: OfflineStatus = yield take(OFFLINE_STATUS)
        if (!offlineAction.offline) {
          // if device is connected now, then we re-trigger vcxInit
          yield call(ensureVcxInitSuccess)
          // end function execution once we have triggered vcx init
          return
        }
      }
    }
  } catch (e) {
    captureError(e)
    console.error(`vcxFailedOfflineSaga: ${e}`)
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

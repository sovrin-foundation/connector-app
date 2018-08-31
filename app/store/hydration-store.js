// @flow
import { call, put, fork, all } from 'redux-saga/effects'
import {
  safeDelete,
  safeGet,
  safeSet,
  secureGet,
  safeMultiRemove,
} from '../services/storage'
import { hydratePushTokenSaga } from '../push-notification/push-notification-store'
import { hydrateEulaAccept } from '../eula/eula-store'
import {
  hydrateConnections,
  hydrateThemes,
  removePersistedThemes,
  hydrateConnectionSaga,
} from '../store/connections-store'
import { hydrateClaimMapSaga } from '../claim/claim-store'
import { CONNECTIONS, PUSH_COM_METHOD, LAST_SUCCESSFUL_BACKUP } from '../common'
import {
  TOUCH_ID_STORAGE_KEY,
  PIN_ENABLED_KEY,
  IN_RECOVERY,
} from '../lock/type-lock'
import {
  hydrateUserStoreSaga,
  removePersistedUserSelectedAvatarImage,
} from './user/user-store'
import { hydrateWalletStoreSaga } from '../wallet/wallet-store'
import {
  promptBackupBanner,
  deletePersistedPassphrase,
} from '../backup/backup-store'
import { STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL } from './type-config-store'
import { STORAGE_KEY_SHOW_BANNER } from '../components/banner/banner-constants'
import { STORAGE_KEY_EULA_ACCEPTANCE } from '../eula/type-eula'
import { hydrateClaimOffersSaga } from '../claim-offer/claim-offer-store'
import { hydrateBackupSaga } from '../backup/backup-store'
import { loadHistorySaga } from '../connection-history/connection-history-store'
import { IS_ALREADY_INSTALLED } from '../common'
import {
  alreadyInstalledAction,
  hydrated,
  ensureVcxInitSuccess,
  hydrateSwitchedEnvironmentDetails,
  initialized,
} from './config-store'
import {
  lockEnable,
  enableTouchIdAction,
  disableTouchIdAction,
  setInRecovery,
} from '../lock/lock-store'
import { captureError } from '../services/error/error-handler'
import { simpleInit, vcxShutdown } from '../bridge/react-native-cxs/RNCxs'
import { STORAGE_KEY_USER_AVATAR_NAME } from './user/type-user-store'
import { safeToDownloadSmsInvitation } from '../sms-pending-invitation/sms-pending-invitation-store'
import { hydrateProofRequestsSaga } from './../proof-request/proof-request-store'
import { deleteItem } from '../services/secure-storage'
import { WALLET_KEY } from '../bridge/react-native-cxs/vcx-transformers'

export function* deleteDeviceSpecificData(): Generator<*, *, *> {
  try {
    const keysToDelete = [
      STORAGE_KEY_SHOW_BANNER,
      PUSH_COM_METHOD,
      LAST_SUCCESSFUL_BACKUP,
      STORAGE_KEY_USER_AVATAR_NAME,
    ]
    yield call(safeMultiRemove, keysToDelete)
    yield call(deleteSecureStorageData)
  } catch (e) {
    console.log(e)
    // deletion fails, now what to do
    captureError(e)
  }
}

function* deleteSecureStorageData(): Generator<*, *, *> {
  try {
    const secureKeysToDelete = [
      WALLET_KEY,
      STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
    ]
    const deleteOperations = []
    for (let index = 0; index < secureKeysToDelete.length; index++) {
      const secureKey = secureKeysToDelete[index]
      // not waiting for one delete operation to finish
      deleteOperations.push(call(deleteItem, secureKey))
    }
    // wait till all delete operations are done in parallel
    yield all(deleteOperations)
  } catch (e) {
    console.log(e)
    // not sure what to do when deletion fails
    captureError(e)
  }
}

export function* deleteWallet(): Generator<*, *, *> {
  try {
    yield* deletePersistedPassphrase()
  } catch (e) {
    //TODO handle catch
  }
}

export function* alreadyInstalledNotFound(): Generator<*, *, *> {
  yield put(alreadyInstalledAction(false))
  yield call(deleteDeviceSpecificData)
  yield put(lockEnable('false'))
  yield put(initialized())
  yield put(hydrated())

  try {
    yield call(safeSet, IS_ALREADY_INSTALLED, 'true')
  } catch (e) {
    // somehow the storage failed, so we need to find someway to store
    // maybe we fallback to file based storage

    // Capture AsyncStorage failed
    captureError(e)
  }
}

export function* hydrate(): any {
  try {
    let isAlreadyInstalled = yield call(safeGet, IS_ALREADY_INSTALLED)
    if (isAlreadyInstalled !== 'true') {
      yield* alreadyInstalledNotFound()
      // do not move forward and end here
      return
    }

    yield put(alreadyInstalledAction(true))
    try {
      // check if privacy policy was accepted or not
      let isEulaAccept = yield call(safeGet, STORAGE_KEY_EULA_ACCEPTANCE)
      if (!isEulaAccept) {
        // if eula was not accepted, then we know that lock was never set
        // so no need to go any further
        yield* alreadyInstalledNotFound()
        return
      }
      isEulaAccept = JSON.parse(isEulaAccept)
      yield put(hydrateEulaAccept(isEulaAccept))

      // restore app lock settings
      const [isLockEnabled, isTouchIdEnabled] = yield all([
        call(safeGet, PIN_ENABLED_KEY),
        call(safeGet, TOUCH_ID_STORAGE_KEY),
      ])

      if (isLockEnabled !== 'true') {
        yield* alreadyInstalledNotFound()
        // do not move forward and end here
        return
      }
      yield put(lockEnable(isLockEnabled))

      //InRecovery determines if we are in the recovery flow
      //and still need to choose if we want to use previous pin or set new pin
      let inRecovery = yield call(safeGet, IN_RECOVERY)
      if (inRecovery === 'true') {
        yield put(setInRecovery(inRecovery))
      }
      if (isTouchIdEnabled === 'true') {
        yield put(enableTouchIdAction())
      } else {
        yield put(disableTouchIdAction())
      }
      // Splash screen does redirection on the basis of three flags
      // 1. if app is opened for first time or not
      // 2. If user has already accepted privacy policy or not
      // 3. If user has enabled any type of lock (pass code, touch id, face id, etc.)
      // Splash screen can start redirection as soon as we have above three flags
      // so we are raising this action which tells splash screen that we have values
      // for all three flags and redirection logic can move forward
      yield put(initialized())

      // replace below line with wallet init saga
      yield call(simpleInit)

      yield* hydrateSwitchedEnvironmentDetails()
      // since we hydrated environment details, so now we can start downloading sms
      yield put(safeToDownloadSmsInvitation())

      yield* hydratePushTokenSaga()
      yield* hydrateWalletStoreSaga()
      yield* hydrateConnectionSaga()
      yield* hydrateProofRequestsSaga()
      yield* hydrateThemes()
      yield* hydrateUserStoreSaga()
      yield* hydrateBackupSaga()
      yield* hydrateClaimMapSaga()
      yield* hydrateClaimOffersSaga()
      yield* loadHistorySaga()

      // TODO: Move vcx shutdown logic inside ensureVcxInitSuccess
      yield call(vcxShutdown, false)
      yield put(hydrated())
      yield* ensureVcxInitSuccess()
    } catch (e) {
      console.error(`hydrateSaga: ${e}`)
      // somehow the secure storage failed, so we need to find someway to store
      // maybe we fallback to file based storage
    }
  } catch (e) {
    // if we did not find any value in user default storage
    // it means that user uninstalled the app and is now trying again
    // or this is a new installation
    console.error(`hydrateSaga: ${e}`)
    yield* alreadyInstalledNotFound()
  }
}

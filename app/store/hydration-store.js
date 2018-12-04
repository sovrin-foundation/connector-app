// @flow
import { call, put, fork, all } from 'redux-saga/effects'
import {
  safeDelete,
  safeGet,
  safeSet,
  safeMultiRemove,
  secureDelete,
  secureGet,
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
import {
  CONNECTIONS,
  PUSH_COM_METHOD,
  LAST_SUCCESSFUL_BACKUP,
  CONNECT_ME_STORAGE_KEY,
  CLAIM_MAP,
  WALLET_ENCRYPTION_KEY,
  WALLET_BALANCE,
  WALLET_ADDRESSES,
  WALLET_HISTORY,
  PASSPHRASE_SALT_STORAGE_KEY,
  PASSPHRASE_STORAGE_KEY,
} from '../common'
import { STORAGE_KEY_USER_ONE_TIME_INFO } from '../store/user/type-user-store'
import { CLAIM_OFFERS } from '../claim-offer/type-claim-offer'
import { STORAGE_KEY_THEMES } from '../store/type-connection-store'
import { HISTORY_EVENT_STORAGE_KEY } from '../connection-history/type-connection-history'
import {
  TOUCH_ID_STORAGE_KEY,
  PIN_ENABLED_KEY,
  IN_RECOVERY,
  PIN_HASH,
  SALT,
} from '../lock/type-lock'
import {
  hydrateUserStoreSaga,
  removePersistedUserSelectedAvatarImage,
} from './user/user-store'
import { hydrateWalletStoreSaga } from '../wallet/wallet-store'
import {
  promptBackupBanner,
  deletePersistedPassphrase,
  hydratePassphraseFromWallet,
} from '../backup/backup-store'
import {
  STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
  __uniqueId,
  ERROR_NO_WALLET_NAME,
} from './type-config-store'
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
import {
  simpleInit,
  vcxShutdown,
  getWalletPoolName,
} from '../bridge/react-native-cxs/RNCxs'
import { STORAGE_KEY_USER_AVATAR_NAME } from './user/type-user-store'
import { safeToDownloadSmsInvitation } from '../sms-pending-invitation/sms-pending-invitation-store'
import { hydrateProofRequestsSaga } from './../proof-request/proof-request-store'
import { WALLET_KEY } from '../bridge/react-native-cxs/vcx-transformers'
import RNFetchBlob from 'react-native-fetch-blob'
import { Platform } from 'react-native'

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
      CONNECTIONS,
      CONNECT_ME_STORAGE_KEY,
      CLAIM_MAP,
      WALLET_ENCRYPTION_KEY,
      WALLET_BALANCE,
      WALLET_ADDRESSES,
      WALLET_HISTORY,
      PASSPHRASE_SALT_STORAGE_KEY,
      PASSPHRASE_STORAGE_KEY,
      CLAIM_OFFERS,
      STORAGE_KEY_USER_ONE_TIME_INFO,
      STORAGE_KEY_THEMES,
      HISTORY_EVENT_STORAGE_KEY,
      PIN_HASH,
      SALT,
    ]
    const deleteOperations = []
    for (let index = 0; index < secureKeysToDelete.length; index++) {
      const secureKey = secureKeysToDelete[index]
      // not waiting for one delete operation to finish
      deleteOperations.push(call(secureDelete, secureKey))
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
    // if there is any error thrown from deletePersistedPassphrase
    captureError(e)
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

export function* confirmFirstInstallationWithWallet(): Generator<*, *, *> {
  const appUniqueId = yield call(secureGet, __uniqueId)
  const walletName = appUniqueId && `${appUniqueId}-cm-wallet`
  if (!walletName) {
    throw new Error(ERROR_NO_WALLET_NAME)
  }
  const { fs } = RNFetchBlob
  const documentDirectory: string = fs.dirs.DocumentDir
  const walletNameExists = yield call(
    fs.exists,
    `${documentDirectory}/.indy_client/wallet/${walletName}`
  )
  if (!walletNameExists) {
    throw new Error(ERROR_NO_WALLET_NAME)
  }
  // do the async set operations
  yield call(safeSet, IS_ALREADY_INSTALLED, 'true')
  yield call(safeSet, STORAGE_KEY_EULA_ACCEPTANCE, 'true')
  yield call(safeSet, PIN_ENABLED_KEY, 'true')
  yield call(safeSet, __uniqueId, appUniqueId)
}

export function* hydrate(): any {
  try {
    let isAlreadyInstalled = yield call(safeGet, IS_ALREADY_INSTALLED)
    if (isAlreadyInstalled !== 'true') {
      try {
        yield* confirmFirstInstallationWithWallet()
      } catch (e) {
        yield* alreadyInstalledNotFound()
        return
      }
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

      if (inRecovery === 'true') {
        // replace below line with wallet init saga
        yield call(simpleInit)
      }

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

      if (inRecovery === 'true') {
        // TODO: Move vcx shutdown logic inside ensureVcxInitSuccess
        yield call(vcxShutdown, false)
      }
      yield put(hydrated())
      const vcxResult = yield* ensureVcxInitSuccess()
      if (vcxResult && vcxResult.fail) {
        throw new Error(JSON.stringify(vcxResult.fail.message))
      }
    } catch (e) {
      captureError(e)
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

export function* hydrateNonReduxData(): Generator<*, *, *> {
  // this saga is supposed to be run while restoring wallet
  // gets the data from wallet and hydrate that data in keychain/keystore
  // reason we are doing this separately than in hydrate saga
  // is that this data is not stored in redux-store because we pull it
  // when needed, so hydrate won't hydrate this data
  // but we still need to take this data out of wallet and put in Keychain
  yield* hydratePassphraseFromWallet()
}

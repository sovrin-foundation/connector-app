// @flow

import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import {
  GENERATE_RECOVERY_PHRASE_SUCCESS,
  GENERATE_BACKUP_FILE_SUCCESS,
  GENERATE_BACKUP_FILE_FAILURE,
  EXPORT_BACKUP_SUCCESS,
  EXPORT_BACKUP_FAILURE,
  BACKUP_COMPLETE,
  BACKUP_STORE_STATUS,
  BACKUP_WALLET_FAIL,
  PROMPT_WALLET_BACKUP_BANNER,
  GENERATE_RECOVERY_PHRASE_FAILURE,
  GENERATE_RECOVERY_PHRASE_LOADING,
  GENERATE_BACKUP_FILE_LOADING,
  EXPORT_BACKUP_LOADING,
  ERROR_EXPORT_BACKUP,
  ERROR_GENERATE_RECOVERY_PHRASE,
  ERROR_GENERATE_BACKUP_FILE,
  ERROR_HYDRATING_BACKUP,
  HYDRATE_BACKUP,
  HYDRATE_BACKUP_FAILURE,
  EXPORT_BACKUP_NO_SHARE,
} from './type-backup'
import type {
  PromptBackupBannerAction,
  BackupStore,
  BackupStoreStatus,
  BackupStoreAction,
  Passphrase,
  ExportBackupLoadingAction,
  GenerateRecoveryPhraseLoadingAction,
  GenerateBackupFileLoadingAction,
} from './type-backup'
import RNFetchBlob from 'react-native-fetch-blob'
import { AsyncStorage, Platform } from 'react-native'
import Share from 'react-native-share'
import type { Saga } from 'redux-saga'
import { setItem, getItem, deleteItem } from '../services/secure-storage'
import type { AgencyPoolConfig } from '../store/type-config-store'
import type { CustomError } from '../common/type-common'
import {
  LAST_SUCCESSFUL_BACKUP,
  PASSPHRASE_SALT_STORAGE_KEY,
  PASSPHRASE_STORAGE_KEY,
} from '../common/secure-storage-constants'
import { getZippedWalletBackupPath } from '../bridge/react-native-cxs/RNCxs'
import {
  getConfig,
  getBackupPassphrase,
  getBackupWalletPath,
} from '../store/store-selector'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import { STORAGE_KEY_SHOW_BANNER } from '../components/banner/banner-constants'
import { getWords } from './secure-passphrase'
import { pinHash as generateKey, generateSalt } from '../lock/pin-hash'
import moment from 'moment'

const initialState = {
  passphrase: { phrase: '', salt: 's', hash: 'h' },
  status: BACKUP_STORE_STATUS.IDLE,
  error: null,
  showBanner: false,
  lastSuccessfulBackup: '',
  backupWalletPath: '',
}

export function* generateBackupSaga(
  action: GenerateBackupFileLoadingAction
): Generator<*, *, *> {
  // WALLET BACKUP ZIP FLOW
  const {
    agencyUrl,
    agencyDID,
    agencyVerificationKey,
    poolConfig,
  }: AgencyPoolConfig = yield select(getConfig)
  const agencyConfig = {
    agencyUrl,
    agencyDID,
    agencyVerificationKey,
    poolConfig,
  }
  const recoveryPassphrase: Passphrase = yield select(getBackupPassphrase)
  try {
    const documentDirectory: string = RNFetchBlob.fs.dirs.DocumentDir
    const backupPath: string = yield call(getZippedWalletBackupPath, {
      documentDirectory,
      agencyConfig,
      recoveryPassphrase,
    })

    yield put(generateBackupFileSuccess(backupPath))
  } catch (e) {
    yield put(
      generateBackupFileFail({
        ...ERROR_GENERATE_BACKUP_FILE,
        message: `${ERROR_GENERATE_BACKUP_FILE.message} ${e.message}`,
      })
    )
  }
}

export function* exportBackupSaga(
  action: ExportBackupLoadingAction
): Generator<*, *, *> {
  try {
    const backupWalletPath: string = yield select(getBackupWalletPath)
    const title: string = `Export ${backupWalletPath.split('/').pop()}`
    Platform.OS === 'android'
      ? yield call(Share.open, {
          title,
          url: `file://${backupWalletPath}`,
          type: 'application/zip',
        })
      : yield call(Share.open, {
          title,
          url: backupWalletPath,
          type: 'application/zip',
          message: 'Export backup!',
          subject: 'Export backup',
        })
    const lastSuccessfulBackup = moment().format()
    yield call(
      AsyncStorage.setItem,
      LAST_SUCCESSFUL_BACKUP,
      lastSuccessfulBackup
    )
    yield put(exportBackupSuccess(lastSuccessfulBackup))
    yield put(promptBackupBanner(false))
  } catch (e) {
    if (e.error === 'User did not share') {
      yield put(exportBackupNoShare())
    } else {
      yield put(
        exportBackupFail({
          ...ERROR_EXPORT_BACKUP,
          message: `${ERROR_EXPORT_BACKUP.message} ${e.message}`,
        })
      )
    }
  }
}
export function* deletePersistedPassphrase(): Generator<*, *, *> {
  yield all([
    call(deleteItem, PASSPHRASE_STORAGE_KEY),
    call(deleteItem, PASSPHRASE_SALT_STORAGE_KEY),
  ])
}

export function* generateRecoveryPhraseSaga(
  action: GenerateRecoveryPhraseLoadingAction
): Generator<*, *, *> {
  try {
    let passphrase: string = yield call(getItem, PASSPHRASE_STORAGE_KEY)
    let passphraseSalt: string = yield call(
      getItem,
      PASSPHRASE_SALT_STORAGE_KEY
    )
    if (!passphrase) {
      const words: string[] = yield call(getWords, 8, 5)
      passphrase = words.join(' ')
      passphraseSalt = yield call(generateSalt)
    }

    const hashedPassphrase: string = yield call(
      generateKey,
      passphrase,
      passphraseSalt
    )
    yield call(setItem, PASSPHRASE_STORAGE_KEY, passphrase)
    yield call(setItem, PASSPHRASE_SALT_STORAGE_KEY, passphraseSalt)
    yield put(
      generateRecoveryPhraseSuccess({
        phrase: passphrase,
        salt: passphraseSalt,
        hash: hashedPassphrase,
      })
    )
    yield put(generateBackupFile())
  } catch (e) {
    yield put(
      generateRecoveryPhraseFail({
        ...ERROR_GENERATE_RECOVERY_PHRASE,
        message: `${ERROR_GENERATE_RECOVERY_PHRASE.message} ${e.message}`,
      })
    )
  }
}

export const generateBackupFileSuccess = (backupWalletPath: string) => ({
  type: GENERATE_BACKUP_FILE_SUCCESS,
  status: BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_SUCCESS,
  backupWalletPath,
})

export const generateBackupFileFail = (error: CustomError) => ({
  type: GENERATE_BACKUP_FILE_FAILURE,
  status: BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_FAILURE,
  error,
})

export const hydrateBackupFail = (error: CustomError) => ({
  type: HYDRATE_BACKUP_FAILURE,
  error,
})

export const generateBackupFile = () => ({
  type: GENERATE_BACKUP_FILE_LOADING,
  status: BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_LOADING,
})

function* watchBackupStart(): any {
  yield takeLatest(GENERATE_BACKUP_FILE_LOADING, generateBackupSaga)
}

function* watchExportBackup(): any {
  yield takeLatest(EXPORT_BACKUP_LOADING, exportBackupSaga)
}

function* watchGenerateRecoveryPhrase(): any {
  yield takeLatest(GENERATE_RECOVERY_PHRASE_LOADING, generateRecoveryPhraseSaga)
}

export function* watchBackup(): any {
  yield all([
    watchBackupStart(),
    watchGenerateRecoveryPhrase(),
    watchExportBackup(),
    watchBackupBannerPrompt(),
  ])
}

export function* watchBackupBannerPrompt(): any {
  yield takeLatest(PROMPT_WALLET_BACKUP_BANNER, backupBannerSaga)
}

export function* hydrateBackupSaga(): Generator<*, *, *> {
  try {
    let lastSuccessfulBackup: ?string = yield call(
      AsyncStorage.getItem,
      LAST_SUCCESSFUL_BACKUP
    )
    if (lastSuccessfulBackup != null) {
      yield put(hydrateBackup(lastSuccessfulBackup))
    } else {
      yield put(
        hydrateBackupFail({
          ...ERROR_HYDRATING_BACKUP,
          message: `${ERROR_HYDRATING_BACKUP.message}`,
        })
      )
    }
  } catch (e) {
    yield put(
      yield put(
        hydrateBackupFail({
          ...ERROR_HYDRATING_BACKUP,
          message: `${ERROR_HYDRATING_BACKUP.message} ${e.message}`,
        })
      )
    )
  }
}

export function* backupBannerSaga(
  action: PromptBackupBannerAction
): Generator<*, *, *> {
  try {
    const { showBanner } = action

    yield call(
      AsyncStorage.setItem,
      STORAGE_KEY_SHOW_BANNER,
      JSON.stringify(showBanner)
    )
  } catch (e) {
    yield put(promptBackupBanner(false))
  }
}

export const hydrateBackup = (lastSuccessfulBackup: string) => ({
  type: HYDRATE_BACKUP,
  lastSuccessfulBackup,
})

export const promptBackupBanner = (
  showBanner: boolean
): PromptBackupBannerAction => ({
  type: PROMPT_WALLET_BACKUP_BANNER,
  showBanner,
})

export const generateRecoveryPhrase = () => ({
  type: GENERATE_RECOVERY_PHRASE_LOADING,
  status: BACKUP_STORE_STATUS.GENERATE_PHRASE_LOADING,
})

export const generateRecoveryPhraseSuccess = (passphrase: Passphrase) => ({
  type: GENERATE_RECOVERY_PHRASE_SUCCESS,
  status: BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_SUCCESS,
  passphrase: passphrase,
})

export const generateRecoveryPhraseFail = (error: CustomError) => ({
  type: GENERATE_RECOVERY_PHRASE_FAILURE,
  status: BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_FAILURE,
  error,
})

export const exportBackup = () => ({
  type: EXPORT_BACKUP_LOADING,
  status: BACKUP_STORE_STATUS.EXPORT_BACKUP_LOADING,
})

export const exportBackupFail = (error: CustomError) => ({
  type: EXPORT_BACKUP_FAILURE,
  error,
  status: BACKUP_STORE_STATUS.EXPORT_BACKUP_FAILURE,
})

export const exportBackupSuccess = (lastSuccessfulBackup: string) => ({
  type: EXPORT_BACKUP_SUCCESS,
  status: BACKUP_COMPLETE,
  lastSuccessfulBackup,
})

export const exportBackupNoShare = () => ({
  type: EXPORT_BACKUP_NO_SHARE,
  status: BACKUP_STORE_STATUS.EXPORT_BACKUP_NO_SHARE,
})

export default function backupReducer(
  state: BackupStore = initialState,
  action: BackupStoreAction
) {
  switch (action.type) {
    case GENERATE_RECOVERY_PHRASE_LOADING: {
      return {
        ...state,
        status: action.status,
        error: null,
      }
    }
    case GENERATE_RECOVERY_PHRASE_SUCCESS: {
      return {
        ...state,
        status: action.status,
        error: action.error,
        passphrase: {
          phrase: action.passphrase.phrase,
          salt: action.passphrase.salt,
          hash: action.passphrase.hash,
        },
      }
    }
    case GENERATE_RECOVERY_PHRASE_FAILURE: {
      return {
        ...state,
        status: action.status,
        error: action.error,
      }
    }
    case GENERATE_BACKUP_FILE_LOADING: {
      return {
        ...state,
        status: action.status,
        error: null,
      }
    }
    case GENERATE_BACKUP_FILE_SUCCESS: {
      return {
        ...state,
        status: action.status,
        error: null,
        backupWalletPath: action.backupWalletPath,
      }
    }
    case GENERATE_BACKUP_FILE_FAILURE: {
      return {
        ...state,
        status: action.status,
        error: action.error,
      }
    }
    case EXPORT_BACKUP_LOADING: {
      return {
        ...state,
        status: action.status,
        error: null,
      }
    }
    case EXPORT_BACKUP_NO_SHARE: {
      return {
        ...state,
        status: action.status,
        error: null,
      }
    }
    case EXPORT_BACKUP_SUCCESS: {
      return {
        ...state,
        error: null,
        status: action.status,
        lastSuccessfulBackup: action.lastSuccessfulBackup,
      }
    }
    case EXPORT_BACKUP_FAILURE: {
      return {
        ...state,
        status: action.status,
        error: action.error,
      }
    }
    case PROMPT_WALLET_BACKUP_BANNER: {
      return {
        ...state,
        showBanner: action.showBanner,
      }
    }
    case BACKUP_WALLET_FAIL: {
      return {
        ...state,
        error: action.error,
      }
    }
    case HYDRATE_BACKUP:
      return {
        ...initialState,
        lastSuccessfulBackup: action.lastSuccessfulBackup,
      }
    case HYDRATE_BACKUP_FAILURE:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}

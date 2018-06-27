// @flow

import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import {
  GENERATE_RECOVERY_PHRASE_SUCCESS,
  GENERATE_RECOVERY_PHRASE,
  GENERATE_BACKUP_FILE_SUCCESS,
  EXPORT_BACKUP,
  EXPORT_BACKUP_SUCCESS,
  BACKUP_COMPLETE,
  BACKUP_STORE_STATUS,
  GENERATE_BACKUP_FILE,
  BACKUP_WALLET_FAIL,
  ERROR_BACKUP_WALLET,
  ERROR_BACKUP_WALLET_SHARE,
  PROMPT_WALLET_BACKUP_BANNER,
} from './type-backup'
import type {
  GenerateBackupFileAction,
  GenerateRecoveryPhraseAction,
  ExportBackupAction,
  PromptBackupBannerAction,
  BackupStore,
  BackupStoreStatus,
  BackupStoreAction,
} from './type-backup'
import RNFetchBlob from 'react-native-fetch-blob'
import { AsyncStorage, Platform } from 'react-native'
import Share from 'react-native-share'
import type { Saga } from 'redux-saga'
import { setItem, getItem } from '../services/secure-storage'
import type { AgencyPoolConfig } from '../store/type-config-store'
import type { CustomError } from '../common/type-common'
import { RESET } from '../common/type-common'
import { LAST_SUCCESSFUL_BACKUP } from '../common/secure-storage-constants'
import { getZippedWalletBackupPath } from '../bridge/react-native-cxs/RNCxs'
import { getConfig } from '../store/store-selector'
import { STORAGE_KEY_SHOW_BANNER } from '../components/banner/banner-constants'
import { getWords } from './secure-passphrase'
import moment from 'moment'

const initialState = {
  passPhrase: { value: '' },
  status: BACKUP_STORE_STATUS.IDLE,
  error: null,
  showBanner: false,
  lastSuccessfulBackup: null,
  backupWalletPath: '',
}

export function* generateBackupSaga(
  action: GenerateBackupFileAction
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
  try {
    const documentDirectory = RNFetchBlob.fs.dirs.DocumentDir
    const backupPath = yield call(getZippedWalletBackupPath, {
      documentDirectory,
      agencyConfig,
    })

    yield put(generateBackupFileSuccess(backupPath))
  } catch (e) {
    yield put(
      backupWalletFail({
        ...ERROR_BACKUP_WALLET,
        message: `${ERROR_BACKUP_WALLET.message}. ${e.message}`,
      })
    )
  }
}

export function* exportBackupSaga(
  action: ExportBackupAction
): Generator<*, *, *> {
  try {
    Platform.OS === 'android'
      ? yield call(Share.open, {
          title: 'Share Your Data Wallet',
          url: `file://${action.backupWalletPath}`,
          type: 'application/zip',
        })
      : yield call(Share.open, {
          title: 'Share Your Data Wallet',
          url: action.backupWalletPath,
          type: 'application/zip',
          message: 'here we go!',
          subject: 'something here maybe?',
        })
    const lastSuccessfulBackup = moment().format()
    yield call(setItem, LAST_SUCCESSFUL_BACKUP, lastSuccessfulBackup)
    yield put(exportBackupSuccess(lastSuccessfulBackup))
    yield put(promptBackupBanner(false))
  } catch (e) {
    yield put(
      backupWalletFail({
        ...ERROR_BACKUP_WALLET,
        message: `${ERROR_BACKUP_WALLET.message}.${e}`,
      })
    )
  }
}

export function* generateRecoveryPhraseSaga(
  action: GenerateRecoveryPhraseAction
): Generator<*, *, *> {
  try {
    let lastSuccessfulBackup = yield call(getItem, LAST_SUCCESSFUL_BACKUP)
    yield put(reset(lastSuccessfulBackup))
    let words = yield call(getWords, 8, 5)
    yield put(generateRecoveryPhraseSuccess(words.join(' ')))
    yield put(generateBackupFile())
  } catch (e) {
    yield put(
      backupWalletFail({
        ...ERROR_BACKUP_WALLET_SHARE,
        message: `${ERROR_BACKUP_WALLET_SHARE.message}.${e}`,
      })
    )
  }
}

export const generateBackupFileSuccess = (backupWalletPath: string) => ({
  type: GENERATE_BACKUP_FILE_SUCCESS,
  isLoading: false,
  backupWalletPath,
  error: null,
})

export const backupWalletFail = (error: CustomError) => ({
  type: BACKUP_WALLET_FAIL,
  error,
})

export const generateBackupFile = () => ({
  type: GENERATE_BACKUP_FILE,
  status: BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE,
  isLoading: true,
})

function* watchBackupStart(): any {
  yield takeLatest(GENERATE_BACKUP_FILE, generateBackupSaga)
}

function* watchExportBackup(): any {
  yield takeLatest(EXPORT_BACKUP, exportBackupSaga)
}

function* watchGenerateRecoveryPhrase(): any {
  yield takeLatest(GENERATE_RECOVERY_PHRASE, generateRecoveryPhraseSaga)
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

export const reset = (lastSuccessfulBackup: string) => ({
  type: RESET,
  lastSuccessfulBackup,
})

export const promptBackupBanner = (
  showBanner: boolean
): PromptBackupBannerAction => ({
  type: PROMPT_WALLET_BACKUP_BANNER,
  showBanner,
})

export const generateRecoveryPhrase = () => ({
  type: GENERATE_RECOVERY_PHRASE,
  isLoading: true,
  status: BACKUP_STORE_STATUS.GENERATE_PHRASE,
  error: null,
})

export const generateRecoveryPhraseSuccess = (passPhrase: string) => ({
  type: GENERATE_RECOVERY_PHRASE_SUCCESS,
  isLoading: false,
  error: null,
  passPhrase,
})

export const exportBackup = () => ({
  type: EXPORT_BACKUP,
  isLoading: true,
  status: BACKUP_STORE_STATUS.EXPORT_BACKUP,
  error: null,
})

export const exportBackupSuccess = (lastSuccessfulBackup: string) => ({
  type: EXPORT_BACKUP_SUCCESS,
  status: BACKUP_COMPLETE,
  lastSuccessfulBackup,
  isLoading: true,
  error: null,
})

export default function backupReducer(
  state: BackupStore = initialState,
  action: BackupStoreAction
) {
  switch (action.type) {
    case GENERATE_RECOVERY_PHRASE: {
      return {
        ...state,
        status: action.status,
        isLoading: action.isLoading,
        error: action.error,
      }
    }
    case GENERATE_RECOVERY_PHRASE_SUCCESS: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: action.error,
        passPhrase: {
          value: action.passPhrase,
        },
      }
    }
    case GENERATE_BACKUP_FILE: {
      return {
        ...state,
        isLoading: action.isLoading,
        status: action.status,
        error: action.error,
      }
    }
    case GENERATE_BACKUP_FILE_SUCCESS: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: action.error,
        backupWalletPath: action.backupWalletPath,
      }
    }
    case EXPORT_BACKUP: {
      return {
        ...state,
        status: action.status,
        isLoading: action.isLoading,
        error: action.error,
      }
    }
    case EXPORT_BACKUP_SUCCESS: {
      return {
        ...state,
        isLoading: action.isLoading,
        error: action.error,
        status: action.status,
        lastSuccessfulBackup: action.lastSuccessfulBackup,
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
        isLoading: action.isLoading,
        error: action.error,
      }
    }
    case RESET:
      return {
        ...initialState,
        lastSuccessfulBackup: action.lastSuccessfulBackup,
      }
    default:
      return state
  }
}

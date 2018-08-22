// @flow

import {
  put,
  takeLatest,
  call,
  all,
  select,
  fork,
  take,
} from 'redux-saga/effects'
import { zip } from 'react-native-zip-archive'
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
  WALLET_FILE_NAME,
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
import { Platform } from 'react-native'
import Share from 'react-native-share'
import type { Saga } from 'redux-saga'
import {
  secureSet,
  secureGet,
  secureDelete,
  safeSet,
  safeGet,
} from '../services/storage'
import type { AgencyPoolConfig } from '../store/type-config-store'
import type { CustomError } from '../common/type-common'
import {
  LAST_SUCCESSFUL_BACKUP,
  PASSPHRASE_SALT_STORAGE_KEY,
  PASSPHRASE_STORAGE_KEY,
} from '../common/secure-storage-constants'
import { encryptWallet } from '../bridge/react-native-cxs/RNCxs'
import {
  getSalt,
  getConfig,
  getBackupPassphrase,
  getBackupWalletPath,
  getVcxInitializationState,
} from '../store/store-selector'
import { STORAGE_KEY_SHOW_BANNER } from '../components/banner/banner-constants'
import { getWords } from './secure-passphrase'
import { VCX_INIT_SUCCESS } from '../store/type-config-store'
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
  const recoveryPassphrase: Passphrase = yield select(getBackupPassphrase)
  const { fs } = RNFetchBlob
  try {
    const documentDirectory: string = fs.dirs.DocumentDir
    const backupTimeStamp = moment().format('YYYY-MM-DD-HH-mm-ss')
    const zipupDirectory: string = `${documentDirectory}/Backup-${backupTimeStamp}`

    // delete zip up directory if it already exists
    const destFileExists = yield call(fs.exists, zipupDirectory)
    if (destFileExists) {
      yield call(fs.unlink, zipupDirectory)
    }

    // create a new zip up directory
    yield call(fs.mkdir, zipupDirectory)
    const destinationZipPath: string = `${documentDirectory}/${WALLET_FILE_NAME}-${backupTimeStamp}.zip`
    const encryptedFileName: string = `${WALLET_FILE_NAME}.wallet`
    const encryptedFileLocation: string = `${zipupDirectory}/${encryptedFileName}`

    // create a file which contains salt needed to decrypt the wallet inside of zip up directory
    const saltValue = yield select(getSalt)
    const saltFileContents = JSON.stringify({ salt: saltValue })
    const saltFileName = `${zipupDirectory}/salt.json`

    const saltFile = yield call(
      fs.createFile,
      saltFileName,
      saltFileContents,
      'utf8'
    )

    // call VCX method to encrypt wallet. Given path to store it, file name, & key to encrypt it
    yield call(encryptWallet, {
      encryptedFileLocation,
      recoveryPassphrase,
    })

    // create zip file of zip up directory contents to be used as backup
    const backupZipFile = yield call(zip, zipupDirectory, destinationZipPath)
    yield put(generateBackupFileSuccess(backupZipFile))
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
        })
    const lastSuccessfulBackup = moment().format()
    yield put(exportBackupSuccess(lastSuccessfulBackup))
    yield put(promptBackupBanner(false))
    yield call(safeSet, LAST_SUCCESSFUL_BACKUP, lastSuccessfulBackup)
  } catch (e) {
    if (e.message === 'User did not share') {
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

// we should not need to call this now
// TODO:KS Verify and remove this
export function* deletePersistedPassphrase(): Generator<*, *, *> {
  yield all([
    call(secureDelete, PASSPHRASE_STORAGE_KEY),
    call(secureDelete, PASSPHRASE_SALT_STORAGE_KEY),
  ])
}

export function* generateRecoveryPhraseSaga(
  action: GenerateRecoveryPhraseLoadingAction
): Generator<*, *, *> {
  const vcxInitializedState = yield select(getVcxInitializationState)
  if (vcxInitializedState !== VCX_INIT_SUCCESS) {
    yield take(VCX_INIT_SUCCESS)
  }
  // If it failed then we'll retry it a few times
  let retryCount = 0
  let lastInitException = new Error('')
  while (retryCount < 4) {
    try {
      let passphrase = yield call(secureGet, PASSPHRASE_STORAGE_KEY)
      let passphraseSalt = yield call(secureGet, PASSPHRASE_SALT_STORAGE_KEY)
      if (!passphrase) {
        const words: string[] = yield call(getWords, 8, 5)
        passphrase = words.join(' ')
        passphraseSalt = yield call(generateSalt)
      }
      const hashedPassphrase = yield call(
        generateKey,
        passphrase,
        passphraseSalt
      )
      yield call(secureSet, PASSPHRASE_STORAGE_KEY, passphrase)
      yield call(secureSet, PASSPHRASE_SALT_STORAGE_KEY, passphraseSalt)
      yield put(
        generateRecoveryPhraseSuccess({
          phrase: passphrase,
          salt: passphraseSalt,
          hash: hashedPassphrase,
        })
      )
      yield put(generateBackupFile())
      break
    } catch (e) {
      lastInitException = e
      retryCount++
    }
  }
  if (retryCount > 3) {
    yield put(
      generateRecoveryPhraseFail({
        ...ERROR_GENERATE_RECOVERY_PHRASE,
        message: `${ERROR_GENERATE_RECOVERY_PHRASE.message}`,
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
  yield takeLatest(PROMPT_WALLET_BACKUP_BANNER, persistBackupBannerStatusSaga)
}

export function* hydrateBackupSaga(): Generator<*, *, *> {
  // We run two hydrations that are needed by this store in single saga
  // we could have merged these two into single hydration and followed
  // one hydration per reducer, for now we are just moving ahead with two
  // Also, these two hydrations runs in parallel, and even if one hydration fails
  // other hydration will continue
  // reason for not using "all" effect of redux-saga is that in all if one saga fails
  // then whole "all" effect is cancelled and other saga are not run to completion
  yield fork(hydrateLastSuccessfulBackupSaga)
  yield fork(hydrateBackupBannerStatusSaga)
}

export function* hydrateLastSuccessfulBackupSaga(): Generator<*, *, *> {
  try {
    let lastSuccessfulBackup = yield call(safeGet, LAST_SUCCESSFUL_BACKUP)
    if (lastSuccessfulBackup != null) {
      yield put(hydrateBackup(lastSuccessfulBackup))
    }
  } catch (e) {
    yield put(
      hydrateBackupFail({
        ...ERROR_HYDRATING_BACKUP,
        message: `${ERROR_HYDRATING_BACKUP.message} ${e.message}`,
      })
    )
  }
}

export function* hydrateBackupBannerStatusSaga(): Generator<*, *, *> {
  try {
    const backupBannerStatus = yield call(safeGet, STORAGE_KEY_SHOW_BANNER)
    if (backupBannerStatus) {
      yield put(promptBackupBanner(JSON.parse(backupBannerStatus)))
    }
  } catch (e) {
    yield put(
      hydrateBackupFail({
        ...ERROR_HYDRATING_BACKUP,
        message: `${ERROR_HYDRATING_BACKUP.message} ${e.message}`,
      })
    )
  }
}

export function* persistBackupBannerStatusSaga(
  action: PromptBackupBannerAction
): Generator<*, *, *> {
  const { showBanner } = action
  try {
    yield call(safeSet, STORAGE_KEY_SHOW_BANNER, JSON.stringify(showBanner))
  } catch (e) {
    yield put(promptBackupBanner(showBanner))
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
        showBanner: state.showBanner,
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

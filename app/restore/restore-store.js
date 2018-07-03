// @flow
import {
  saveFileDocumentsDirectory,
  decryptWalletFile,
} from '../bridge/react-native-cxs/RNCxs'
import { takeLatest, all, put, call, take } from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import {
  SAVE_FILE_TO_APP_DIRECTORY,
  RESTORE_STATUS,
  ERROR_RESTORE,
  RESTORE_SUBMIT_PASSPHRASE,
  RestoreStatus,
  initialState,
  FILE_SAVE_ERROR_MESSAGE,
  DECRYPT_FAILED_MESSAGE,
} from './type-restore'
import type {
  SaveToAppDirectory,
  RestoreActions,
  SaveFiletoAppDirectoryAction,
  RestoreSubmitPassphrase,
  RestoreStore,
} from './type-restore'

export const saveFileToAppDirectory = (data: SaveToAppDirectory) => ({
  type: SAVE_FILE_TO_APP_DIRECTORY,
  data,
})

export const restoreStatus = (status: string) => ({
  type: RESTORE_STATUS,
  status,
})

export const errorRestore = (error: CustomError) => ({
  type: ERROR_RESTORE,
  error,
})

export const submitPassphrase = (passphrase: string) => ({
  type: RESTORE_SUBMIT_PASSPHRASE,
  passphrase,
})

export function* restoreFileDecrypt(
  action: RestoreSubmitPassphrase
): Generator<*, *, *> {
  try {
    const { passphrase } = action
    yield put(restoreStatus(RestoreStatus.DECRYPTION_START))
    yield call(decryptWalletFile, passphrase)
    yield put(restoreStatus(RestoreStatus.FILE_DECRYPT_SUCCESS))
  } catch (e) {
    yield put(errorRestore(DECRYPT_FAILED_MESSAGE(e.message)))
  }
}

export function* saveZipFile(
  action: SaveFiletoAppDirectoryAction
): Generator<*, *, *> {
  try {
    yield put(restoreStatus(RestoreStatus.ZIP_FILE_SELECTED))
    const { uri } = action.data
    yield call(saveFileDocumentsDirectory, uri)
    yield put(restoreStatus(RestoreStatus.fileSaved))
    yield takeLatest(RESTORE_SUBMIT_PASSPHRASE, restoreFileDecrypt)
  } catch (e) {
    yield put(restoreStatus(RestoreStatus.FILE_SAVE_ERROR))
    yield put(errorRestore(FILE_SAVE_ERROR_MESSAGE(e.message)))
  }
}

export function* restoreSaga(): any {
  yield takeLatest(SAVE_FILE_TO_APP_DIRECTORY, saveZipFile)
}

export function* watchRestore(): any {
  yield all([restoreSaga()])
}

export default function restoreReducer(
  state: RestoreStore = initialState,
  action: RestoreActions
) {
  switch (action.type) {
    case SAVE_FILE_TO_APP_DIRECTORY:
      return {
        ...state,
        status: RestoreStatus.none,
        error: null,
        restoreFile: action.data,
      }
    case RESTORE_SUBMIT_PASSPHRASE:
      return {
        ...state,
        error: null,
        passphrase: action.passphrase,
      }
    case ERROR_RESTORE:
      return {
        ...state,
        error: action.error,
        status: RestoreStatus.failedStatus,
      }
    case RESTORE_STATUS:
      return {
        ...state,
        status: action.status,
        error: null,
      }
    default:
      return state
  }
}

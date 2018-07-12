// @flow
import {
  saveFileDocumentsDirectory,
  decryptWalletFile,
} from '../bridge/react-native-cxs/RNCxs'
import { takeLatest, all, put, call, take, select } from 'redux-saga/effects'
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
import RNFetchBlob from 'react-native-fetch-blob'
import { getRestoreStatus } from '../store/store-selector'

import { Platform } from 'react-native'

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
    if ((yield select(getRestoreStatus)) !== 'FILE_SAVED_TO_APP_DIRECTORY') {
      while (true) {
        const { status } = yield take(RESTORE_STATUS)

        if (status === 'FILE_SAVED_TO_APP_DIRECTORY') {
          break
        }
      }
    }

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
    const { fs } = RNFetchBlob
    let destPath = fs.dirs.DocumentDir + '/restore.zip'
    let tempUri = uri
    //For android emulators the content uri is like "content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2Fbackup.zip"
    //so it needs to be decoded and split from "/raw:" to get the real path
    //For android device the content uri is of form "Content://com.android.providers.downloads.documents/document/223" which can be used directly
    //For IOS device uri is like "file:///private/var/mobile/Containers/Data/Application/A80FE508-BCED-4950-B9D0-8F1AA1E967B6/tmp/com.evernym.connectme.callcenter-Inbox/backup.zip"
    // which we need to split from /private to get the real path
    if (Platform.OS === 'android') {
      tempUri = decodeURIComponent(uri).split('/raw:')[1]
        ? decodeURIComponent(uri).split('/raw:')[1]
        : uri
    } else {
      tempUri = uri.split('/private')[1]
    }

    let sourceFileExists =
      tempUri != null ? yield call(fs.exists, tempUri) : false

    if (sourceFileExists) {
      const destFileExists = yield call(fs.exists, destPath)
      if (destFileExists) {
        yield call(fs.unlink, destPath)
      }

      yield call(fs.cp, tempUri, destPath)
      yield put(restoreStatus(RestoreStatus.fileSaved))
    } else {
      yield put(restoreStatus(RestoreStatus.FILE_SAVE_ERROR))
      yield put(
        errorRestore(FILE_SAVE_ERROR_MESSAGE('source file does not exist'))
      )
    }
  } catch (e) {
    yield put(restoreStatus(RestoreStatus.FILE_SAVE_ERROR))
    yield put(errorRestore(FILE_SAVE_ERROR_MESSAGE(e.message)))
  }
}

export function* restoreSaga(): any {
  yield takeLatest(SAVE_FILE_TO_APP_DIRECTORY, saveZipFile)
}

export function* watchSubmitPassphrase(): any {
  yield takeLatest(RESTORE_SUBMIT_PASSPHRASE, restoreFileDecrypt)
}

export function* watchRestore(): any {
  yield all([restoreSaga(), watchSubmitPassphrase()])
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

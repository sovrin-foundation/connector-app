// @flow
import type { ReactNavigation, CustomError } from '../common/type-common'
import type { Store } from '../store/type-store'

export const SAVE_FILE_TO_APP_DIRECTORY: 'SAVE_FILE_TO_APP_DIRECTORY' =
  'SAVE_FILE_TO_APP_DIRECTORY'
export const RESTORE_STATUS: 'RESTORE_STATUS' = 'RESTORE_STATUS'
export const ERROR_RESTORE: 'ERROR_RESTORE' = 'ERROR_RESTORE'
export const RESTORE_SUBMIT_PASSPHRASE: 'RESTORE_SUBMIT_PASSPHRASE' =
  'RESTORE_SUBMIT_PASSPHRASE'
export const RESTORE_RESET: 'RESTORE_RESET' = 'RESTORE_RESET'

export const RestoreStatus = {
  ZIP_FILE_SELECTED: 'ZIP_FILE_SELECTED',
  fileSaved: 'FILE_SAVED_TO_APP_DIRECTORY',
  FILE_SAVE_ERROR: 'FILE_SAVE_ERROR',
  DECRYPTION_START: 'DECRYPTION_START',
  FILE_DECRYPT_SUCCESS: 'FILE_DECRYPT_SUCCESS',
  RESTORE_DATA_STORE_START: 'RESTORE_DATA_STORE_START',
  RESTORE_DATA_STORE_SUCCESS: 'RESTORE_DATA_STORE_SUCCESS',
  success: 'RESTORE_SUCCESS',
  failedStatus: 'RESTORE_FAILED',
  none: 'none',
}

export const initialState = {
  status: RestoreStatus.none,
  error: null,
  restoreFile: {
    fileName: '',
    fileSize: 0,
    type: '',
    uri: '',
  },
}

export type SaveToAppDirectory = {
  fileName: string,
  fileSize: number,
  type: string,
  uri: string,
}

export type RestoreSubmitPassphrase = {
  type: typeof RESTORE_SUBMIT_PASSPHRASE,
  passphrase: string,
}

export type ResetRestoreAction = {
  type: typeof RESTORE_RESET,
}

export type SaveFiletoAppDirectoryAction = {
  type: typeof SAVE_FILE_TO_APP_DIRECTORY,
  data: SaveToAppDirectory,
}

export type ErrorRestoreAction = {
  type: typeof ERROR_RESTORE,
  error: ?CustomError,
}

export type RestoreStatusAction = {
  type: typeof RESTORE_STATUS,
  status: string,
}

export type RestoreSubmitPassphraseAction = {
  type: typeof RESTORE_SUBMIT_PASSPHRASE,
  passphrase: string,
}

export type RestoreActions =
  | SaveFiletoAppDirectoryAction
  | ErrorRestoreAction
  | RestoreStatusAction
  | RestoreSubmitPassphraseAction
  | ResetRestoreAction

export type RestoreStore = {
  restoreFile: SaveToAppDirectory,
} & StoreError &
  RestoreStoreStatus

export type StoreError = { error: ?CustomError }
export type RestoreStoreStatus = { status: $Keys<typeof RestoreStatus> }

export type RestoreProps = {
  updateStatusBarTheme: string => void,
  saveFileToAppDirectory: SaveToAppDirectory => void,
  restore: RestoreStoreType,
  route: string,
} & ReactNavigation

export type RestorePassphraseProps = {
  submitPassphrase: string => void,
  restore: RestoreStoreType,
} & ReactNavigation

export type RestoreStoreType = {
  status: $Keys<typeof RestoreStatus>,
  error: ?CustomError,
  restoreFile: {
    fileName: string,
    fileSize: number,
    type: string,
    uri: string,
  },
}

export type RestoreWaitScreenProps = {
  restore: RestoreStoreType,
  route: string,
} & ReactNavigation

export const ERROR_RESTORE_FILE = {
  code: 'WR-001',
  message: 'Error while restoring',
}

export const FILE_SAVE_ERROR_MESSAGE = (message: string) => ({
  code: 'WR-002',
  message: `Error while saving file to app directory:${message}`,
})

export const DECRYPT_FAILED_MESSAGE = (message: string) => ({
  code: 'WR-003',
  message: `Error while decryption:${message}`,
})

export const RESTORE_BACK_BUTTON_TEST_ID = 'restore-back-button'
export const RESTORE_CLOSE_BUTTON_TEST_ID = 'restore-close-button'
export const RESTORE_DATA_FAILED_MESSAGE = (message: string) => ({
  code: 'WR-004',
  message: `Error while restoring data store:${message}`,
})

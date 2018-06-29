import type { ReactNavigation } from '../common/type-common'
import type { CustomError } from '../common/type-common'
import type { IsValid } from '../components/input-control/type-input-control'

export type GenerateRecoveryPhraseProps = {
  recoveryPassphrase: string,
} & ReactNavigation

export type GenerateRecoveryPhraseState = {}

export type VerifyRecoveryPhraseProps = {} & ReactNavigation

export type VerifyRecoveryPhraseState = {
  recoveryPassphrase: string,
  error: boolean,
}

export type ExportBackupFileProps = {
  walletBackup: () => void,
  backupPath: string,
} & ReactNavigation

export type ExportBackupFileState = {
  submitButtonText: string,
}

export type BackupCompleteProps = {} & ReactNavigation

export type BackupCompleteState = {
  submitButtonText: string,
  recoveryPassphrase: string,
}

export const BACKUP_STORE_STATUS = {
  IDLE: 'IDLE',
  GENERATE_PHRASE: 'GENERATE_PHRASE',
  GENERATE_BACKUP_FILE: 'GENERATE_BACKUP_FILE',
  EXPORT_BACKUP: 'EXPORT_BACKUP',
  BACKUP_COMPLETE: 'BACKUP_COMPLETE',
}

export type Passphrase = {
  phrase: string,
  salt: string,
  hash: string,
}

export type BackupStore = {
  passphrase: Passphrase,
  backupWalletPath: string,
  showBanner: boolean,
  lastSuccessfulBackup: string,
  isLoading: boolean,
} & StoreError &
  BackupStoreStatus

export type StoreError = { error: ?CustomError }
export type BackupStoreStatus = { status: $Keys<typeof BACKUP_STORE_STATUS> }

export const ERROR_BACKUP_WALLET = {
  code: 'WB-001',
  message: 'Error while backing up wallet',
}

export const ERROR_BACKUP_WALLET_SHARE = {
  code: 'WB-002',
  message: 'Error while sharing zipped backup',
}

export const ERROR_HYDRATING_BACKUP = {
  code: 'WB-004',
  message: 'Error hydrating backup',
}

export const START_BACKUP = 'START_BACKUP'
export const GENERATE_BACKUP_FILE = 'GENERATE_BACKUP_FILE'
export const GENERATE_BACKUP_FILE_SUCCESS = 'GENERATE_BACKUP_FILE_SUCCESS'
export const BACKUP_WALLET_FAIL = 'BACKUP_WALLET_FAIL'
export const GENERATE_RECOVERY_PHRASE = 'GENERATE_RECOVERY_PHRASE'
export const GENERATE_RECOVERY_PHRASE_SUCCESS =
  'GENERATE_RECOVERY_PHRASE_SUCCESS'
export const EXPORT_BACKUP = 'EXPORT_BACKUP'
export const EXPORT_BACKUP_SUCCESS = 'EXPORT_BACKUP_SUCCESS'
export const BACKUP_COMPLETE = 'BACKUP_COMPLETE'
export const HYDRATE_BACKUP = 'HYDRATE_BACKUP'
export const HYDRATE_BACKUP_FAILURE = 'HYDRATE_BACKUP_FAILURE'
export const PROMPT_WALLET_BACKUP_BANNER = 'PROMPT_WALLET_BACKUP_BANNER'

export type BackupStartAction = {
  type: typeof START_BACKUP,
  status: BACKUP_STORE_STATUS,
  isLoading: boolean,
  error: CustomError,
}

export type GenerateBackupFileAction = {
  type: typeof GENERATE_BACKUP_FILE_LOADING,
  status: BACKUP_STORE_STATUS,
  isLoading: boolean,
  error: CustomError,
}

export type GenerateBackupFileSuccessAction = {
  type: typeof GENERATE_BACKUP_FILE_SUCCESS,
  backupWalletPath: string,
  isLoading: boolean,
  error: CustomError,
}

export type BackupWalletFailAction = {
  type: typeof BACKUP_WALLET_FAIL,
  status: BACKUP_STORE_STATUS,
  isLoading: boolean,
  error: CustomError,
}

export type GenerateRecoveryPhraseAction = {
  type: typeof GENERATE_RECOVERY_PHRASE,
  status: BACKUP_STORE_STATUS,
  isLoading: boolean,
  error: CustomError,
}

export type GenerateRecoveryPhraseSuccessAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_SUCCESS,
  status: BACKUP_STORE_STATUS,
  isLoading: boolean,
  passphrase: Passphrase,
  error: CustomError,
}

export type ExportBackupAction = {
  type: typeof EXPORT_BACKUP,
  status: BACKUP_STORE_STATUS,
  backupWalletPath: string,
  isLoading: boolean,
  error: CustomError,
}

export type ExportBackupSuccessAction = {
  type: typeof EXPORT_BACKUP_SUCCESS,
  status: BACKUP_STORE_STATUS,
  isLoading: boolean,
  error: CustomError,
}

export type BackupCompleteAction = {
  type: typeof BACKUP_COMPLETE,
  status: BACKUP_STORE_STATUS,
}

export type HydrateBackupAction = {
  type: typeof HYDRATE_BACKUP,
  status: BACKUP_STORE_STATUS,
}

export type HydrateBackupFailAction = {
  type: typeof HYDRATE_BACKUP_FAILURE,
  error: CustomError,
}

export type BackupStoreAction =
  | BackupStartAction
  | GenerateBackupFileAction
  | GenerateBackupFileSuccessAction
  | BackupWalletFailAction
  | GenerateRecoveryPhraseAction
  | GenerateRecoveryPhraseLoadingAction
  | GenerateRecoveryPhraseSuccessAction
  | ExportBackupAction
  | ExportBackupSuccessAction
  | BackupCompleteAction
  | HydrateBackupAction
  | HydrateBackupFailAction

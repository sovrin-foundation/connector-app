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
  GENERATE_PHRASE_LOADING: 'GENERATE_PHRASE_LOADING',
  GENERATE_PHRASE_SUCCESS: 'GENERATE_PHRASE_SUCCESS',
  GENERATE_PHRASE_FAILURE: 'GENERATE_PHRASE_FAILURE',
  GENERATE_BACKUP_FILE_LOADING: 'GENERATE_BACKUP_FILE_LOADING',
  GENERATE_BACKUP_FILE_SUCCESS: 'GENERATE_BACKUP_FILE_SUCCESS',
  GENERATE_BACKUP_FILE_FAILURE: 'GENERATE_BACKUP_FILE_FAILURE',
  EXPORT_BACKUP_LOADING: 'EXPORT_BACKUP_LOADING',
  EXPORT_BACKUP_SUCCESS: 'EXPORT_BACKUP_SUCCESS',
  EXPORT_BACKUP_FAILURE: 'EXPORT_BACKUP_FAILURE',
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
} & StoreError &
  BackupStoreStatus

export type StoreError = { error: ?CustomError }
export type BackupStoreStatus = { status: $Keys<typeof BACKUP_STORE_STATUS> }

export const ERROR_EXPORT_BACKUP = {
  code: 'WB-001',
  message: 'Error while exporting backup file',
}

export const ERROR_GENERATE_BACKUP_FILE = {
  code: 'WB-002',
  message: 'Error while generating backup file',
}

export const ERROR_GENERATE_RECOVERY_PHRASE = {
  code: 'WB-003',
  message: 'Error while generating recovery phrase',
}

export const ERROR_HYDRATING_BACKUP = {
  code: 'WB-004',
  message: 'Error hydrating backup',
}

export const START_BACKUP = 'START_BACKUP'
export const GENERATE_BACKUP_FILE_LOADING = 'GENERATE_BACKUP_FILE_LOADING'
export const GENERATE_BACKUP_FILE_SUCCESS = 'GENERATE_BACKUP_FILE_SUCCESS'
export const GENERATE_BACKUP_FILE_FAILURE = 'GENERATE_BACKUP_FILE_FAILURE'
export const BACKUP_WALLET_FAIL = 'BACKUP_WALLET_FAIL'
export const GENERATE_RECOVERY_PHRASE_LOADING =
  'GENERATE_RECOVERY_PHRASE_LOADING'
export const GENERATE_RECOVERY_PHRASE_SUCCESS =
  'GENERATE_RECOVERY_PHRASE_SUCCESS'
export const GENERATE_RECOVERY_PHRASE_FAILURE =
  'GENERATE_RECOVERY_PHRASE_FAILURE'
export const EXPORT_BACKUP_LOADING = 'EXPORT_BACKUP_LOADING'
export const EXPORT_BACKUP_SUCCESS = 'EXPORT_BACKUP_SUCCESS'
export const EXPORT_BACKUP_FAILURE = 'EXPORT_BACKUP_FAILURE'
export const BACKUP_COMPLETE = 'BACKUP_COMPLETE'
export const HYDRATE_BACKUP = 'HYDRATE_BACKUP'
export const HYDRATE_BACKUP_FAILURE = 'HYDRATE_BACKUP_FAILURE'
export const PROMPT_WALLET_BACKUP_BANNER = 'PROMPT_WALLET_BACKUP_BANNER'

export type BackupStartAction = {
  type: typeof START_BACKUP,
  status: BACKUP_STORE_STATUS,
  error: CustomError,
}

export type GenerateBackupFileLoadingAction = {
  type: typeof GENERATE_BACKUP_FILE_LOADING,
  status: BACKUP_STORE_STATUS,
}

export type GenerateBackupFileSuccessAction = {
  type: typeof GENERATE_BACKUP_FILE_SUCCESS,
  backupWalletPath: string,
}

export type GenerateBackupFileFailureAction = {
  type: typeof GENERATE_BACKUP_FILE_SUCCESS,
  error: CustomError,
}

export type BackupWalletFailAction = {
  type: typeof BACKUP_WALLET_FAIL,
  status: BACKUP_STORE_STATUS,
  error: CustomError,
}

export type GenerateRecoveryPhraseLoadingAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_LOADING,
  status: BACKUP_STORE_STATUS,
}

export type GenerateRecoveryPhraseSuccessAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_SUCCESS,
  status: BACKUP_STORE_STATUS,
  passphrase: Passphrase,
}

export type GenerateRecoveryPhraseFailureAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_FAILURE,
  status: BACKUP_STORE_STATUS,
  error: CustomError,
}

export type ExportBackupLoadingAction = {
  type: typeof EXPORT_BACKUP_LOADING,
  status: BACKUP_STORE_STATUS,
  backupWalletPath: string,
}

export type ExportBackupSuccessAction = {
  type: typeof EXPORT_BACKUP_SUCCESS,
  status: BACKUP_STORE_STATUS,
}

export type ExportBackupFailureAction = {
  type: typeof EXPORT_BACKUP_FAILURE,
  status: BACKUP_STORE_STATUS,
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
  | GenerateBackupFileLoadingAction
  | GenerateBackupFileSuccessAction
  | BackupWalletFailAction
  | GenerateRecoveryPhraseLoadingAction
  | GenerateRecoveryPhraseSuccessAction
  | GenerateBackupFileFailureAction
  | ExportBackupLoadingAction
  | ExportBackupSuccessAction
  | BackupCompleteAction
  | HydrateBackupAction
  | HydrateBackupFailAction

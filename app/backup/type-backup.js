// @flow
import type { ReactNavigation } from '../common/type-common'
import type { CustomError } from '../common/type-common'
import type { IsValid } from '../components/input-control/type-input-control'

export type ReactNavigationBackup = {
  navigation: {
    navigate: (route: string, params?: any) => void,
    goBack: (route?: ?string) => void,
    state: {
      params: {
        recoveryPassphrase?: string,
        initialRoute: string,
      },
    },
  },
}

export type GenerateRecoveryPhraseProps = {
  generateRecoveryPhrase: () => void,
  recoveryPassphrase: Passphrase,
} & ReactNavigationBackup

export type GenerateRecoveryPhraseState = {}

export type VerifyRecoveryPhraseProps = {
  recoveryPassphrase: Passphrase,
} & ReactNavigationBackup

export type VerifyRecoveryPhraseState = {
  error: boolean,
}

export type ExportBackupFileProps = {
  backupPath: string,
  backupStatus: string,
  exportBackup: () => void,
} & ReactNavigationBackup

export type BackupErrorProps = {
  updateStatusBarTheme: string => void,
  generateBackupFile: () => void,
} & ReactNavigationBackup

export type ExportBackupFileState = {
  submitButtonText: string,
}

export type BackupCompleteProps = {} & ReactNavigationBackup

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
  EXPORT_BACKUP_NO_SHARE: 'EXPORT_BACKUP_NO_SHARE',
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
  // TODO: fix flow type
  error: any,
  status: string,
}

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
export const EXPORT_BACKUP_NO_SHARE = 'EXPORT_BACKUP_NO_SHARE'
export const BACKUP_COMPLETE = 'BACKUP_COMPLETE'
export const HYDRATE_BACKUP = 'HYDRATE_BACKUP'
export const HYDRATE_BACKUP_FAILURE = 'HYDRATE_BACKUP_FAILURE'
export const PROMPT_WALLET_BACKUP_BANNER = 'PROMPT_WALLET_BACKUP_BANNER'
export const WALLET_FILE_NAME = 'ConnectMe'

export type BackupStartAction = {
  type: typeof START_BACKUP,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  error: CustomError,
}

export type GenerateBackupFileLoadingAction = {
  type: typeof GENERATE_BACKUP_FILE_LOADING,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
}

export type GenerateBackupFileSuccessAction = {
  type: typeof GENERATE_BACKUP_FILE_SUCCESS,
  backupWalletPath: string,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
}

export type GenerateBackupFileFailureAction = {
  type: typeof GENERATE_BACKUP_FILE_FAILURE,
  error: CustomError,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
}

export type BackupWalletFailAction = {
  type: typeof BACKUP_WALLET_FAIL,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  error: CustomError,
}

export type GenerateRecoveryPhraseLoadingAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_LOADING,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
}

export type GenerateRecoveryPhraseSuccessAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_SUCCESS,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  passphrase: Passphrase,
  error: CustomError,
}

export type GenerateRecoveryPhraseFailureAction = {
  type: typeof GENERATE_RECOVERY_PHRASE_FAILURE,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  error: CustomError,
}

export type ExportBackupLoadingAction = {
  type: typeof EXPORT_BACKUP_LOADING,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  backupWalletPath: string,
}

export type ExportBackupNoShareAction = {
  type: typeof EXPORT_BACKUP_NO_SHARE,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
}

export type ExportBackupSuccessAction = {
  type: typeof EXPORT_BACKUP_SUCCESS,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  lastSuccessfulBackup: string,
}

export type ExportBackupFailureAction = {
  type: typeof EXPORT_BACKUP_FAILURE,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  error: CustomError,
}

export type BackupCompleteAction = {
  type: typeof BACKUP_COMPLETE,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
}

export type HydrateBackupAction = {
  type: typeof HYDRATE_BACKUP,
  status: $Keys<typeof BACKUP_STORE_STATUS>,
  lastSuccessfulBackup: string,
}

export type HydrateBackupFailAction = {
  type: typeof HYDRATE_BACKUP_FAILURE,
  error: CustomError,
}

export type PromptBackupBannerAction = {
  type: typeof PROMPT_WALLET_BACKUP_BANNER,
  showBanner: boolean,
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
  | ExportBackupFailureAction
  | ExportBackupNoShareAction
  | BackupCompleteAction
  | HydrateBackupAction
  | HydrateBackupFailAction

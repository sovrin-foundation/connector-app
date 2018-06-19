import type { ReactNavigation } from '../common/type-common'
import type { CustomError } from '../common/type-common'
import type { IsValid } from '../components/input-control/type-input-control'

export type GenerateRecoveryPhraseProps = {} & ReactNavigation

export type GenerateRecoveryPhraseState = {
  recoveryPassphrase: string,
}

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
  recoveryPassphrase: string,
}

export type BackupCompleteProps = {} & ReactNavigation

export type BackupCompleteState = {
  submitButtonText: string,
  recoveryPassphrase: string,
}

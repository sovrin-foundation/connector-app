// @flow

import backupReducer, {
  generateBackupFile,
  generateRecoveryPhrase,
  generateRecoveryPhraseSuccess,
  generateBackupFileSuccess,
  exportBackup,
  exportBackupSuccess,
  promptBackupBanner,
} from '../backup-store'
import { BACKUP_STORE_STATUS } from '../type-backup'
import { getStore } from '../../../__mocks__/static-data'
import { backupWalletFail } from '../../wallet/wallet-store'
import { ERROR_BACKUP_WALLET } from '../../wallet/type-wallet'
describe('store: backup-store: ', () => {
  let initialState
  beforeEach(() => {
    initialState = {
      passphrase: { phrase: '', salt: 's', hash: 'h' },
      status: BACKUP_STORE_STATUS.IDLE,
      error: null,
      showBanner: false,
      lastSuccessfulBackup: '',
      backupWalletPath: '',
    }
  })
  const {
    backupWalletPath,
    passphrase,
    lastSuccessfulBackup,
  } = getStore().getState().backup
  const generateRecoveryPhraseState = backupReducer(
    initialState,
    generateRecoveryPhrase()
  )
  const generateRecoveryPhraseSuccessState = backupReducer(
    generateRecoveryPhraseState,
    generateRecoveryPhraseSuccess(passphrase)
  )
  const generateBackupFileState = backupReducer(
    generateRecoveryPhraseState,
    generateBackupFile()
  )
  const generateBackupFileSuccessState = backupReducer(
    generateBackupFileState,
    generateBackupFileSuccess(backupWalletPath)
  )
  const exportBackupState = backupReducer(
    generateBackupFileSuccessState,
    exportBackup()
  )

  it('action: GENERATE_RECOVERY_PHRASE', () => {
    expect(
      backupReducer(initialState, generateRecoveryPhrase())
    ).toMatchSnapshot()
  })

  it('action: GENERATE_RECOVERY_PHRASE_SUCCESS', () => {
    expect(
      backupReducer(
        generateRecoveryPhraseState,
        generateRecoveryPhraseSuccess(passphrase)
      )
    ).toMatchSnapshot()
  })

  it('action: GENERATE_BACKUP_FILE', () => {
    expect(
      backupReducer(generateRecoveryPhraseSuccessState, generateBackupFile())
    ).toMatchSnapshot()
  })

  it('action: GENERATE_BACKUP_FILE_SUCCESS', () => {
    expect(
      backupReducer(
        generateBackupFileState,
        generateBackupFileSuccess(backupWalletPath)
      )
    ).toMatchSnapshot()
  })

  it('action: EXPORT_BACKUP', () => {
    expect(
      backupReducer(generateBackupFileSuccessState, exportBackup())
    ).toMatchSnapshot()
  })

  it('action: EXPORT_BACKUP_SUCCESS', () => {
    expect(
      backupReducer(
        exportBackupState,
        exportBackupSuccess(lastSuccessfulBackup)
      )
    ).toMatchSnapshot()
  })

  // TODO: fix flow type
  // it('action: PROMPT_WALLET_BACKUP_BANNER', () => {
  //   expect(
  //     backupReducer(initialState, promptBackupBanner(true))
  //   ).toMatchSnapshot()
  // })

  it('action: BACKUP_WALLET_FAIL', () => {
    expect(
      backupReducer(initialState, backupWalletFail(ERROR_BACKUP_WALLET))
    ).toMatchSnapshot()
  })
})

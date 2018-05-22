// @flow
import type { ReactNavigation } from '../common/type-common'

export type SettingsProps = {
  touchIdActive: boolean,
  selectUserAvatar: () => void,
  walletBackup: {
    status: string,
    encryptionKey: string,
  },
} & ReactNavigation

export type SettingsState = {
  walletBackupModalVisible: boolean,
}

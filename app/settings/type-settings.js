// @flow
import type { NavigationScreenProp } from 'react-navigation'

export type SettingsProps = {
  touchIdActive: boolean,
  selectUserAvatar: () => void,
  walletBackup: {
    status: string,
    encryptionKey: string,
  },
} & NavigationScreenProp

export type SettingsState = {
  walletBackupModalVisible: boolean,
}

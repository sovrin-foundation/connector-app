// @flow
import type { ReactNavigation } from '../common/type-common'

export type SettingsProps = {
  touchIdActive: boolean,
  selectUserAvatar: () => void,
} & ReactNavigation

export type BackupWalletProps = {
  status: string,
  render: Function,
}

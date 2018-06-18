// @flow
import type { ReactNavigation } from '../../common/type-common'

export type BannerProps = {
  walletBackup: () => {},
  promptBackupBanner: (showBackup: boolean) => {},
} & ReactNavigation

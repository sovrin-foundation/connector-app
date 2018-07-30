// @flow
import type { ReactNavigation } from '../../common/type-common'

export type BannerProps = {
  walletBackup: () => {},
  promptBackupBanner: (showBackup: boolean) => {},
  lastSuccessfulBackupTimeStamp: string,
  showBanner: boolean,
} & ReactNavigation

export type DangerBannerProps = {
  testID: string,
  onPress?: () => void,
  bannerTitle: string,
  bannerSubtext: string,
}

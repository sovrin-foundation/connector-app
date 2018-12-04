// @flow

import type { ReactNavigation } from '../common/type-common'
import type { ConfigStore } from '../store/type-config-store'
import type { DeepLinkStore } from '../deep-link/type-deep-link'
import type { SMSPendingInvitationStore } from '../sms-pending-invitation/type-sms-pending-invitation'
import type { LockStore, PendingRedirection } from '../lock/type-lock'
import type { EulaStore } from '../eula/type-eula'

export type SplashScreenProps = {
  eula: EulaStore,
  isInitialized: boolean,
  deepLink: DeepLinkStore,
  smsPendingInvitation: SMSPendingInvitationStore,
  lock: LockStore,
  getSmsPendingInvitation: (token: string) => void,
  addPendingRedirection: (
    pendingRedirection: Array<?PendingRedirection>
  ) => void,
  safeToDownloadSmsInvitation: () => void,
  deepLinkProcessed: (data: string) => void,
} & ReactNavigation

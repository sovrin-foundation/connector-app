// @flow
import type { LockStore } from '../lock/type-lock'
import type { SMSPendingInvitationStore } from '../sms-pending-invitation/type-sms-pending-invitation'
import type { AuthenticationStore } from '../authentication/type-authentication'
import type { ClaimOfferStore } from '../claim-offer/type-claim-offer'
import type { ProofRequestStore } from '../proof-request/type-proof-request'
import type { InvitationStore } from '../invitation/type-invitation'
import type { ConnectionStore } from './type-connection-store'
import type { ConfigStore } from './type-config-store'
import type { ClaimStore } from '../claim/type-claim'
import type { ProofStore } from '../proof/type-proof'
import type { UserStore } from './user/type-user-store'
import type { ConnectionHistoryStore } from '../connection-history/type-connection-history'
import type { DeepLinkStore } from '../deep-link/type-deep-link'
import type { WalletStore } from '../wallet/type-wallet'
import type { EulaStore } from '../eula/type-eula'
import type { BackupStore } from '../backup/type-backup'
import type { RestoreStore } from '../restore/type-restore'
import type { LedgerStore } from './ledger/type-ledger-store'
import type { OfflineStore } from '../offline/type-offline'
import type { OnfidoStore } from '../onfido/type-onfido'

export type PushNotificationStore = {
  isAllowed: boolean,
  notification: ?{
    [string]: any,
  },
  pushToken: ?string,
  pendingFetchAdditionalDataKey?: ?{
    [string]: boolean,
  },
}

export type RouteStore = {
  currentScreen: string,
  timeStamp: number,
}

export type Store = {
  config: ConfigStore,
  connections: ConnectionStore,
  deepLink: DeepLinkStore,
  authentication: AuthenticationStore,
  pushNotification: PushNotificationStore,
  route: RouteStore,
  user: UserStore,
  lock: LockStore,
  smsPendingInvitation: SMSPendingInvitationStore,
  claimOffer: ClaimOfferStore,
  proofRequest: ProofRequestStore,
  invitation: InvitationStore,
  claim: ClaimStore,
  proof: ProofStore,
  history: ConnectionHistoryStore,
  wallet: WalletStore,
  eula: EulaStore,
  backup: BackupStore,
  restore: RestoreStore,
  ledger: LedgerStore,
  offline: OfflineStore,
  onfido: OnfidoStore,
}

export type { AuthenticationStore } from '../authentication/type-authentication'

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

export type PushNotificationStore = {
  isAllowed: boolean,
  notification: ?{
    [string]: any,
  },
  pushToken: ?string,
}

export type RouteStore = {
  currentScreen: string,
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
}

export type { AuthenticationStore } from '../authentication/type-authentication'

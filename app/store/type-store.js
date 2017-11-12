// @flow
import type { LockStore } from '../lock/type-lock'
import type { SMSPendingInvitationStore } from '../sms-pending-invitation/type-sms-pending-invitation'
import type { AuthenticationStore } from '../authentication/type-authentication'
import type { ClaimOfferStore } from '../claim-offer/type-claim-offer'
import type { ProofRequestStore } from '../proof-request/type-proof-request'
import type { InvitationStore } from '../invitation/type-invitation'

// TODO: Add type for each store here
export type UserStore = {
  [string]: any,
}

export type PushNotificationStore = {
  isAllowed: boolean,
  notification: ?{
    [string]: any,
  },
  pushToken: ?string,
}

export type Connection = {
  identifier: string,
  logoUrl: string,
  senderDID: string,
  senderEndpoint: string,
  size: number,
  name: string,
}

export type Connections = { [senderDID: string]: Connection }

export type ConnectionStore = {
  // TODO:PS Add specific keys in connection store
  [string]: any,
  data: ?Connections,
}

export type ApiUrls = {
  agencyUrl: string,
  callCenterUrl: string,
}

export type ConfigStore = {
  isAlreadyInstalled: boolean,
  isHydrated: boolean,
  showErrorAlerts: boolean,
} & ApiUrls

export type DeepLinkStore = {
  token: ?string,
  isLoading: boolean,
  error: ?any, // fix this to use global error object
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
}

export type { AuthenticationStore } from '../authentication/type-authentication'

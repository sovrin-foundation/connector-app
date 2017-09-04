// @flow
import type {
  QrConnectionRequestStore,
} from '../qr-connection-request/type-qr-connection-request'
import type { LockStore } from '../lock/type-lock'
import type {
  SMSConnectionRequestStore,
} from '../sms-connection-request/type-sms-connection-request'

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

export type ConnectionStore = {
  [string]: any,
}

export type InvitationStore = {
  [string]: any,
}

export type ApiUrls = {
  agencyUrl: string,
  callCenterUrl: string,
}

export type ConfigStore = {
  isAlreadyInstalled: boolean,
  isHydrated: boolean,
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
  invitation: InvitationStore,
  pushNotification: PushNotificationStore,
  qrConnection: QrConnectionRequestStore,
  route: RouteStore,
  user: UserStore,
  lock: LockStore,
  smsConnection: SMSConnectionRequestStore,
}

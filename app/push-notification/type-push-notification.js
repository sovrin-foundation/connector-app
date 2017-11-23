// @flow

import type { CustomError, GenericObject } from '../common/type-common'
import type { PendingRedirection } from '../lock/type-lock'
import type { Claim } from '../claim/type-claim'

export type NotificationPayload = {
  forDID: string,
  uid: string,
  type: string,
  senderLogoUrl?: ?string,
}

export const PUSH_NOTIFICATION_PERMISSION = 'PUSH_NOTIFICATION_PERMISSION'
export type PushNotificationPermissionAction = {
  type: typeof PUSH_NOTIFICATION_PERMISSION,
  isAllowed: boolean,
}

export const PUSH_NOTIFICATION_RECEIVED = 'PUSH_NOTIFICATION_RECEIVED'
export type PushNotificationReceivedAction = {
  type: typeof PUSH_NOTIFICATION_RECEIVED,
  notification: DownloadedNotification,
}

export const PUSH_NOTIFICATION_UPDATE_TOKEN = 'PUSH_NOTIFICATION_UPDATE_TOKEN'
export type PushNotificationUpdateTokenAction = {
  type: typeof PUSH_NOTIFICATION_UPDATE_TOKEN,
  token: string,
}

export const FETCH_ADDITIONAL_DATA = 'FETCH_ADDITIONAL_DATA'
export type FetchAdditionalDataAction = {
  type: typeof FETCH_ADDITIONAL_DATA,
  notificationPayload: NotificationPayload,
}

export const FETCH_ADDITIONAL_DATA_ERROR = 'FETCH_ADDITIONAL_DATA_ERROR'
export type FetchAdditionalDataErrorAction = {
  type: typeof FETCH_ADDITIONAL_DATA_ERROR,
  isPristine: boolean,
  isFetching: boolean,
  error: CustomError,
}

export type PushNotificationAction =
  | PushNotificationPermissionAction
  | PushNotificationReceivedAction
  | PushNotificationUpdateTokenAction
  | FetchAdditionalDataAction
  | FetchAdditionalDataErrorAction

export type DownloadedNotification = {
  additionalData: GenericObject,
  type: string,
  uid: string,
  senderLogoUrl?: ?string,
  remotePairwiseDID?: ?string,
}

export type PushNotificationStore = {
  isAllowed: boolean,
  notification: ?DownloadedNotification,
  pushToken: ?string,
  isPristine: boolean,
  isFetching: boolean,
  error: ?CustomError,
}

export type AdditionalDataResponse = {
  msgs: [
    {
      statusCode: string,
      edgeAgentPayload: string,
      typ: string,
      statusMsg: string,
      uid: string,
    },
  ],
}

export type Attribute = {
  label: string,
  data?: string,
  type?: string,
}

export type AdditionalData = {
  name: string,
  version: string,
  revealedAttributes: Array<Attribute>,
  claimDefinitionSchemaSequenceNumber: number,
}
export type AdditionalProofData = {
  name: string,
  version: string,
  revealedAttributes: Array<Attribute>,
}

export type AdditionalProofDataPayload = {
  data: AdditionalProofData,
  issuer: {
    name: string,
    did: string,
  },
  statusMsg?: string,
}

export type AdditionalDataPayload = {
  data: AdditionalData,
  issuer: {
    name: string,
    did: string,
  },
  statusMsg?: string,
}

export type ClaimOfferPushPayload = {
  msg_type: string,
  version: string,
  to_did: string,
  from_did: string,
  iid: string,
  mid: string,
  claim: {
    name: Array<string>,
    date_of_birth: Array<string>,
    height: Array<string>,
  },
  claim_name: string,
  schema_seq_no: number,
  issuer_did: string,
  issuer_name: string,
  nonce: string,
  optional_data: GenericObject,
  remoteName: string,
}

export type NotificationPayloadInfo = {
  uid: string,
  senderLogoUrl: string,
  remotePairwiseDID: string,
}

export type ClaimPushPayload = {
  msg_type: string,
  version: string,
  claim_offer_id: string,
  from_did: string,
  to_did: string,
  claim: { [string]: Array<string> },
  schema_seq_no: number,
  issuer_did: string,
  signature: {
    primary_claim: {
      m2: string,
      a: string,
      e: string,
      v: string,
    },
    non_revocation_claim?: GenericObject,
  },
  optional_data?: GenericObject,
}

export type NextPropsPushNotificationNavigator = {
  pushNotification: {
    notification: DownloadedNotification,
  },
  notificationPayload?: ?NotificationPayload,
  currentScreen: string,
  isAppLocked: boolean,
}

export type PushNotificationNavigatorProps = {
  fetchAdditionalData: (notificationPayload: NotificationPayload) => void,
  authenticationRequestReceived: (data: DownloadedNotification) => void,
  claimOfferReceived: (payload: AdditionalDataPayload) => void,
  proofRequestReceived: (payload: AdditionalDataPayload) => void,
  addPendingRedirection: (
    pendingRedirection: Array<PendingRedirection>
  ) => void,
  navigateToRoute: (routeName: string) => void,
  claimReceived: (claim: Claim) => void,
} & NextPropsPushNotificationNavigator

export type ClaimProofNavigation = {
  goBack: () => void,
  state: {
    params: {
      uid: string,
    },
  },
}

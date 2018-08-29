// @flow

import type { Item } from '../components/custom-list/type-custom-list'
import type {
  ReactNavigation,
  GenericObject,
  CustomError,
  ResetAction,
} from '../common/type-common'
import {
  INVITATION_RECEIVED,
  INVITATION_REJECTED,
} from '../invitation/type-invitation'
import type { InvitationReceivedAction } from '../invitation/type-invitation'
import type { NewConnectionAction } from '../store/type-connection-store'
import {
  CLAIM_OFFER_RECEIVED,
  CLAIM_OFFER_ACCEPTED,
  CLAIM_OFFER_IGNORED,
  CLAIM_OFFER_REJECTED,
  SEND_CLAIM_REQUEST,
} from '../claim-offer/type-claim-offer'
import type { SendClaimRequestAction } from '../claim-offer/type-claim-offer'
import type { ClaimReceivedAction } from '../claim/type-claim'
import type { ClaimOfferReceivedAction } from '../claim-offer/type-claim-offer'
import { CLAIM_STORAGE_SUCCESS } from '../claim/type-claim'
import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_ACCEPTED,
  PROOF_REQUEST_IGNORED,
  PROOF_REQUEST_REJECTED,
  SEND_PROOF_SUCCESS,
} from '../proof-request/type-proof-request'
import type { Connection } from '../connection/type-connection'
import type {
  ProofRequestReceivedAction,
  SendProofSuccessAction,
  AdditionalProofDataPayload,
} from '../proof-request/type-proof-request'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import { PROOF_SUCCESS } from '../proof/type-proof'
import type {
  Attribute,
  AdditionalDataPayload,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'
import type { ClaimMap } from '../claim/type-claim'

export const HISTORY_EVENT_STATUS = {
  [INVITATION_RECEIVED]: 'CONNECTION REQUEST',
  [NEW_CONNECTION_SUCCESS]: 'CONNECTED',
  [INVITATION_REJECTED]: 'CONNECTION REJECTED',
  [SEND_CLAIM_REQUEST]: 'PENDING',
  [CLAIM_OFFER_RECEIVED]: 'CLAIM OFFER RECEIVED',
  [CLAIM_OFFER_ACCEPTED]: 'ACCEPTED OFFER',
  [CLAIM_OFFER_IGNORED]: 'IGNORED OFFER',
  [CLAIM_OFFER_REJECTED]: 'REJECTED OFFER',
  [CLAIM_STORAGE_SUCCESS]: 'RECEIVED',
  [PROOF_REQUEST_RECEIVED]: 'PROOF RECEIVED',
  [PROOF_REQUEST_IGNORED]: 'IGNORED',
  [PROOF_REQUEST_REJECTED]: 'REJECTED',
  [SEND_PROOF_SUCCESS]: 'SHARED',
}

export type HistoryEventStatus = $Keys<typeof HISTORY_EVENT_STATUS>

export const HISTORY_EVENT_TYPE = {
  INVITATION: 'INVITATION',
  CLAIM: 'CLAIM',
  PROOF: 'PROOF',
  AUTHENTICATION: 'AUTHENTICATION',
}

export type HistoryEventType = $Keys<typeof HISTORY_EVENT_TYPE>

export const EventTypeToEventStatusMap = {
  INVITATION: [
    INVITATION_RECEIVED,
    NEW_CONNECTION_SUCCESS,
    INVITATION_REJECTED,
  ],
  CLAIM: [
    CLAIM_OFFER_RECEIVED,
    CLAIM_OFFER_ACCEPTED,
    CLAIM_OFFER_IGNORED,
    CLAIM_OFFER_REJECTED,
    CLAIM_STORAGE_SUCCESS,
  ],
  PROOF: [
    PROOF_REQUEST_RECEIVED,
    PROOF_REQUEST_ACCEPTED,
    PROOF_REQUEST_IGNORED,
    PROOF_REQUEST_REJECTED,
  ],
}

export type ConnectionHistoryEvent = {
  action: string,
  data: Array<Item> | GenericObject,
  id: string,
  name: string,
  status: string, // HistoryEventStatus
  timestamp: string,
  type: HistoryEventType,
  remoteDid: string,
  originalPayload: GenericObject,
  showBadge?: boolean,
}

export type ConnectionHistoryItem = {
  action: string,
  data: Array<Attribute>,
  id: string,
  name: string,
  originalPayload: {
    type: typeof CLAIM_OFFER_RECEIVED | typeof PROOF_REQUEST_RECEIVED,
    payload: AdditionalDataPayload | AdditionalProofDataPayload,
    payloadInfo: NotificationPayloadInfo,
  },
  remoteDid: string,
  status: string,
  timestamp: string,
  type: string,
}

export type ConnectionHistoryDetailsProps = {
  navigation: {
    state: {
      params: {
        type: string,
        id?: string,
        type?: string,
        icon?: string,
        action?: string,
        status?: string,
        timestamp?: string,
        data?: Array<Item>,
        claimMap?: ?ClaimMap,
      },
    },
  },
}

export type ConnectionHistoryData = {
  [string]: Array<ConnectionHistoryEvent>,
}

export const LOAD_HISTORY = 'LOAD_HISTORY'

export type LoadHistoryAction = {
  type: typeof LOAD_HISTORY,
}

export const LOAD_HISTORY_SUCCESS = 'LOAD_HISTORY_SUCCESS'

export type LoadHistorySuccessAction = {
  type: typeof LOAD_HISTORY_SUCCESS,
  data: ConnectionHistoryData,
}

export const LOAD_HISTORY_FAIL = 'LOAD_HISTORY_FAIL'
export const LOAD_HISTORY_EVENT_OCCURED_FAIL = 'LOAD_HISTORY_EVENT_OCCURED_FAIL'

export type LoadHistoryFailAction = {
  type: typeof LOAD_HISTORY_FAIL,
  error: CustomError,
}

export const HISTORY_EVENT_OCCURRED = 'HISTORY_EVENT_OCCURRED'

//TODO : add ClaimReceivedAction
export type HistoryEventOccurredEventType =
  | InvitationReceivedAction
  | NewConnectionAction
  | ClaimOfferReceivedAction
  | ProofRequestReceivedAction
  | SendProofSuccessAction
  | SendClaimRequestAction
  | ResetAction

export type HistoryEventOccurredAction = {
  type: typeof HISTORY_EVENT_OCCURRED,
  event: HistoryEventOccurredEventType,
}

export const RECORD_HISTORY_EVENT = 'RECORD_HISTORY_EVENT'

export type RecordHistoryEventAction = {
  type: typeof RECORD_HISTORY_EVENT,
  historyEvent: ConnectionHistoryEvent,
}

export const DELETE_HISTORY_EVENT = 'DELETE_HISTORY_EVENT'

export type DeleteHistoryEventAction = {
  type: typeof DELETE_HISTORY_EVENT,
  historyEvent: ConnectionHistoryEvent,
}

export const ERROR_LOADING_HISTORY = {
  code: 'CN002',
  message: 'Error while loading connection history data',
}

export const ERROR_HISTORY_EVENT_OCCURRED = {
  code: 'CN003',
  message: 'Error while history event occurred',
}

export type ConnectionHistoryAction =
  | LoadHistoryAction
  | LoadHistorySuccessAction
  | LoadHistoryFailAction
  | RecordHistoryEventAction
  | HistoryEventOccurredAction
  | DeleteHistoryEventAction

export type ConnectionHistoryStore = {
  error?: ?CustomError,
  isLoading: boolean,
  data: ?ConnectionHistoryData,
}

export const HISTORY_EVENT_STORAGE_KEY = 'HISTORY_EVENT_STORAGE_KEY'

export type ConnectionHistoryProps = {
  claimMap: ?ClaimMap,
  activeConnectionThemePrimary: string,
  activeConnectionThemeSecondary: string,
  connectionHistory: {
    [string]: ConnectionHistoryEvent[],
  },
  updateStatusBarTheme: (color?: string) => void,
  deleteConnectionAction: (senderDID: string) => void,
  goToUIScreen: (
    string,
    string,
    $PropertyType<ReactNavigation, 'navigation'>
  ) => void,
} & ReactNavigation

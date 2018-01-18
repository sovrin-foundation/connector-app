// @flow

import type { Item } from '../components/custom-list/type-custom-list'
import type {
  ReactNavigation,
  GenericObject,
  CustomError,
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
} from '../claim-offer/type-claim-offer'
import type { ClaimOfferReceivedAction } from '../claim-offer/type-claim-offer'
import { CLAIM_RECEIVED } from '../claim/type-claim'
import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_ACCEPTED,
  PROOF_REQUEST_IGNORED,
  PROOF_REQUEST_REJECTED,
  PROOF_REQUEST_AUTO_FILL,
} from '../proof-request/type-proof-request'
import type {
  ProofRequestReceivedAction,
  ProofRequestAutoFillAction,
  AdditionalProofDataPayload,
} from '../proof-request/type-proof-request'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import { PROOF_SUCCESS } from '../proof/type-proof'
import type {
  Attribute,
  AdditionalDataPayload,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'

export const HISTORY_EVENT_STATUS = {
  [INVITATION_RECEIVED]: 'CONNECTION REQUEST',
  [NEW_CONNECTION_SUCCESS]: 'CONNECTED',
  [INVITATION_REJECTED]: 'CONNECTION REJECTED',
  [CLAIM_OFFER_RECEIVED]: 'RECEIVED',
  [CLAIM_OFFER_ACCEPTED]: 'ACCEPTED OFFER',
  [CLAIM_OFFER_IGNORED]: 'IGNORED OFFER',
  [CLAIM_OFFER_REJECTED]: 'REJECTED OFFER',
  [CLAIM_RECEIVED]: 'ACCEPTED & SAVED',
  [PROOF_REQUEST_RECEIVED]: 'PROOF RECEIVED',
  [PROOF_REQUEST_IGNORED]: 'IGNORED',
  [PROOF_REQUEST_REJECTED]: 'REJECTED',
  [PROOF_REQUEST_AUTO_FILL]: 'SHARED',
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
    CLAIM_RECEIVED,
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

export type HistoryEventOccurredEventType =
  | InvitationReceivedAction
  | NewConnectionAction
  | ClaimOfferReceivedAction
  | ProofRequestReceivedAction
  | ProofRequestAutoFillAction

export type HistoryEventOccurredAction = {
  type: typeof HISTORY_EVENT_OCCURRED,
  event: HistoryEventOccurredEventType,
}

export const RECORD_HISTORY_EVENT = 'RECORD_HISTORY_EVENT'

export type RecordHistoryEventAction = {
  type: typeof RECORD_HISTORY_EVENT,
  historyEvent: ConnectionHistoryEvent,
}

export const ERROR_LOADING_HISTORY = {
  code: 'CN002',
  message: 'Error while loading connection history data',
}

export const ERROR_HISTORY_EVENT_OCCURED = {
  code: 'CN003',
  message: 'Error while history event occured',
}

export type ConnectionHistoryAction =
  | LoadHistoryAction
  | LoadHistorySuccessAction
  | LoadHistoryFailAction
  | RecordHistoryEventAction
  | HistoryEventOccurredAction

export type ConnectionHistoryStore = {
  error?: ?CustomError,
  isLoading: boolean,
  data: ?ConnectionHistoryData,
}

export const HISTORY_EVENT_STORAGE_KEY = 'HISTORY_EVENT_STORAGE_KEY'

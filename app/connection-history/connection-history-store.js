// @flow
import {
  all,
  takeLatest,
  takeEvery,
  put,
  call,
  select,
} from 'redux-saga/effects'
import {
  LOAD_HISTORY,
  LOAD_HISTORY_SUCCESS,
  LOAD_HISTORY_FAIL,
  RECORD_HISTORY_EVENT,
  ERROR_LOADING_HISTORY,
  HISTORY_EVENT_OCCURRED,
  EventTypeToEventStatusMap,
  HISTORY_EVENT_STATUS,
  HISTORY_EVENT_TYPE,
  HISTORY_EVENT_STORAGE_KEY,
} from './type-connection-history'
import type {
  HistoryEventType,
  HistoryEventStatus,
  ConnectionHistoryEvent,
  ConnectionHistoryData,
  ConnectionHistoryAction,
  ConnectionHistoryStore,
  HistoryEventOccurredAction,
  HistoryEventOccurredEventType,
} from './type-connection-history'
import type { CustomError, GenericObject } from '../common/type-common'
import type { InvitationPayload } from '../invitation/type-invitation'
import { uuid } from '../services/uuid'
import { INVITATION_RECEIVED } from '../invitation/type-invitation'
import moment from 'moment'
import type { NewConnectionAction } from '../store/type-connection-store'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import type { ClaimOfferReceivedAction } from '../claim-offer/type-claim-offer'
import { CLAIM_OFFER_RECEIVED } from '../claim-offer/type-claim-offer'
import type {
  ProofRequestReceivedAction,
  ProofRequestAutoFillAction,
  ProofRequestPayload,
} from '../proof-request/type-proof-request'
import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_AUTO_FILL,
} from '../proof-request/type-proof-request'
import { setItem, getItem } from '../services/secure-storage'
import { getProofRequest } from '../store/store-selector'

const initialState = {
  error: null,
  isLoading: false,
  data: null,
}

export const loadHistory = () => ({
  type: LOAD_HISTORY,
})

export const loadHistorySuccess = (data: ConnectionHistoryData) => ({
  type: LOAD_HISTORY_SUCCESS,
  data,
})

export const loadHistoryFail = (error: CustomError) => ({
  type: LOAD_HISTORY_FAIL,
  error,
})

export function* loadHistorySaga(): Generator<*, *, *> {
  try {
    const historyEvents = yield call(getItem, HISTORY_EVENT_STORAGE_KEY)
    if (historyEvents) {
      yield put(loadHistorySuccess(JSON.parse(historyEvents)))
    } else {
      yield put(loadHistoryFail(ERROR_LOADING_HISTORY))
    }
  } catch (e) {
    yield put(
      loadHistoryFail({
        ...ERROR_LOADING_HISTORY,
        message: `${ERROR_LOADING_HISTORY.message} ${e.message}`,
      })
    )
  }
}

export function* watchLoadHistory(): Generator<*, *, *> {
  yield takeLatest(LOAD_HISTORY, loadHistorySaga)
}

// receive invitation
export function convertInvitationToHistoryEvent(
  invitation: InvitationPayload
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[INVITATION_RECEIVED],
    data: {},
    id: uuid(),
    name: invitation.senderName,
    status: HISTORY_EVENT_STATUS[INVITATION_RECEIVED],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.INVITATION,
    remoteDid: invitation.senderDID,
    originalPayload: invitation,
  }
}

// accept invitation
export function convertConnectionSuccessToHistoryEvent(
  action: NewConnectionAction
): ConnectionHistoryEvent {
  const { senderName, senderDID } = action.connection

  return {
    action: HISTORY_EVENT_STATUS[NEW_CONNECTION_SUCCESS],
    data: [{ label: 'Established On', data: moment().format() }],
    id: uuid(),
    name: senderName,
    status: HISTORY_EVENT_STATUS[NEW_CONNECTION_SUCCESS],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.INVITATION,
    remoteDid: senderDID,
    originalPayload: action,
  }
}

// claim offer received
export function convertClaimOfferToHistoryEvent(
  action: ClaimOfferReceivedAction
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[CLAIM_OFFER_RECEIVED],
    data: action.payload.data.revealedAttributes,
    id: uuid(),
    name: action.payload.data.name,
    status: HISTORY_EVENT_STATUS[CLAIM_OFFER_RECEIVED],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.CLAIM,
    remoteDid: action.payloadInfo.remotePairwiseDID,
    originalPayload: action,
  }
}

// TODO:KS Add claim accepted
//export function convertClaimAcceptedToHistoryEvent(): ConnectionHistoryEvent {}

// TODO:KS Add claim received
//export function convertClaimReceivedToHistoryEvent(): ConnectionHistoryEvent {}

// TODO:KS Add proof request received
export function convertProofRequestToHistoryEvent(
  action: ProofRequestReceivedAction
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[PROOF_REQUEST_RECEIVED],
    data: action.payload.data.requestedAttributes,
    id: uuid(),
    name: action.payload.data.name,
    status: HISTORY_EVENT_STATUS[PROOF_REQUEST_RECEIVED],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.PROOF,
    remoteDid: action.payloadInfo.remotePairwiseDID,
    originalPayload: action,
  }
}

export function convertProofAutoFillToHistoryEvent(
  action: ProofRequestAutoFillAction,
  proofRequestName: string,
  remoteDid: string
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[PROOF_REQUEST_AUTO_FILL],
    data: action.requestedAttributes,
    id: uuid(),
    name: proofRequestName,
    status: HISTORY_EVENT_STATUS[PROOF_REQUEST_AUTO_FILL],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.PROOF,
    remoteDid,
    originalPayload: action,
  }
}

export const recordHistoryEvent = (historyEvent: ConnectionHistoryEvent) => ({
  type: RECORD_HISTORY_EVENT,
  historyEvent,
})

export const historyEventOccurred = (event: HistoryEventOccurredEventType) => ({
  type: HISTORY_EVENT_OCCURRED,
  event,
})

export function* historyEventOccurredSaga(
  action: HistoryEventOccurredAction
): Generator<*, *, *> {
  const { event, type } = action
  let historyEvent: ConnectionHistoryEvent

  if (event.type === INVITATION_RECEIVED) {
    historyEvent = convertInvitationToHistoryEvent(event.data.payload)
  }

  if (event.type === NEW_CONNECTION_SUCCESS) {
    historyEvent = convertConnectionSuccessToHistoryEvent(event)
  }

  if (event.type === CLAIM_OFFER_RECEIVED) {
    historyEvent = convertClaimOfferToHistoryEvent(event)
  }

  if (event.type === PROOF_REQUEST_RECEIVED) {
    historyEvent = convertProofRequestToHistoryEvent(event)
  }

  if (event.type === PROOF_REQUEST_AUTO_FILL) {
    const proofRequest: ProofRequestPayload = yield select(
      getProofRequest,
      event.uid
    )
    historyEvent = convertProofAutoFillToHistoryEvent(
      event,
      proofRequest.originalProofRequestData.name,
      proofRequest.remotePairwiseDID
    )
  }

  if (historyEvent) {
    yield put(recordHistoryEvent(historyEvent))
  }
}

export function* watchHistoryEventOccurred(): Generator<*, *, *> {
  yield takeEvery(HISTORY_EVENT_OCCURRED, historyEventOccurredSaga)
}

export function* watchConnectionHistory(): Generator<*, *, *> {
  yield all([watchLoadHistory(), watchHistoryEventOccurred()])
}

export default function connectionHistoryReducer(
  state: ConnectionHistoryStore = initialState,
  action: ConnectionHistoryAction
) {
  switch (action.type) {
    case LOAD_HISTORY:
      return {
        ...state,
        isLoading: true,
      }

    case LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
        isLoading: false,
      }

    case LOAD_HISTORY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    case RECORD_HISTORY_EVENT: {
      const { remoteDid } = action.historyEvent
      return {
        ...state,
        data: {
          ...(state.data ? state.data : {}),
          [remoteDid]: [
            ...(state.data ? state.data[remoteDid] : []),
            action.historyEvent,
          ],
        },
      }
    }

    default:
      return state
  }
}

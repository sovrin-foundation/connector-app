// $FlowFixMe
import {
  all,
  takeLatest,
  takeEvery,
  put,
  call,
  select,
} from 'redux-saga/effects'
import merge from 'lodash.merge'
import { CONNECTIONS } from '../common'
import {
  LOAD_HISTORY,
  LOAD_HISTORY_SUCCESS,
  LOAD_HISTORY_FAIL,
  RECORD_HISTORY_EVENT,
  DELETE_HISTORY_EVENT,
  ERROR_LOADING_HISTORY,
  HISTORY_EVENT_OCCURRED,
  EventTypeToEventStatusMap,
  HISTORY_EVENT_STATUS,
  HISTORY_EVENT_TYPE,
  HISTORY_EVENT_STORAGE_KEY,
  ERROR_HISTORY_EVENT_OCCURRED,
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
  DeleteHistoryEventAction,
} from './type-connection-history'
import type { Connection } from '../store/type-connection-store'
import type {
  CustomError,
  GenericObject,
  GenericStringObject,
} from '../common/type-common'
import type { InvitationPayload } from '../invitation/type-invitation'
import { uuid } from '../services/uuid'
import { INVITATION_RECEIVED } from '../invitation/type-invitation'
import moment from 'moment'
import type { NewConnectionAction } from '../store/type-connection-store'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import type {
  SendClaimRequestAction,
  ClaimOfferPayload,
} from '../claim-offer/type-claim-offer'
import type { ClaimStorageSuccessAction } from '../claim/type-claim'
import type { Proof } from '../proof/type-proof'
import { SEND_CLAIM_REQUEST } from '../claim-offer/type-claim-offer'
import type {
  ProofRequestReceivedAction,
  SendProofSuccessAction,
  ProofRequestPayload,
} from '../proof-request/type-proof-request'
import {
  PROOF_REQUEST_RECEIVED,
  SEND_PROOF_SUCCESS,
} from '../proof-request/type-proof-request'
import { setItem, getItem } from '../services/secure-storage'
import {
  getProofRequest,
  getProof,
  getClaimOffer,
  getPendingHistoryEvent,
} from '../store/store-selector'
import { CLAIM_STORAGE_SUCCESS } from '../claim/type-claim'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import { RESET } from '../common/type-common'

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

export function* watchLoadHistory(): any {
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

// claim request pending
export function convertSendClaimRequestToHistoryEvent(
  action: SendClaimRequestAction
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[SEND_CLAIM_REQUEST],
    data: action.payload.data.revealedAttributes,
    id: uuid(),
    name: action.payload.data.name,
    status: HISTORY_EVENT_STATUS[SEND_CLAIM_REQUEST],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.CLAIM,
    remoteDid: action.payload.remotePairwiseDID,
    originalPayload: action,
  }
}

// TODO:KS Add claim accepted
//export function convertClaimAcceptedToHistoryEvent(): ConnectionHistoryEvent {}

export function convertClaimStorageSuccessToHistoryEvent(
  action: ClaimStorageSuccessAction,
  claim: ClaimOfferPayload
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[CLAIM_STORAGE_SUCCESS],
    data: claim.data.revealedAttributes,
    id: uuid(),
    name: claim.data.name,
    status: HISTORY_EVENT_STATUS[CLAIM_STORAGE_SUCCESS],
    timestamp: moment().format(),
    type: HISTORY_EVENT_TYPE.CLAIM,
    remoteDid: claim.remotePairwiseDID,
    originalPayload: action,
  }
}

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

function mapSentAttributes(
  revealedAttributes: Array<GenericStringObject>,
  selfAttestedAttributes: Array<GenericStringObject>,
  requestedAttributes: Array<Array<Attribute>>
): Array<Attribute> {
  let sentAttributes = []
  if (revealedAttributes) {
    const revealedAttributeKeys = Object.keys(revealedAttributes)
    Object.values(revealedAttributes).forEach((revealedAttribute, index) => {
      sentAttributes.push({
        label: requestedAttributes[revealedAttributeKeys[index]].name,
        key: revealedAttributeKeys[index],
        data: revealedAttribute[1],
        claimUuid: revealedAttribute[0],
      })
    })
  }

  if (selfAttestedAttributes) {
    const selfAttestedAttributesKeys = Object.keys(selfAttestedAttributes)
    Object.values(selfAttestedAttributes).forEach(
      (selfAttestedAttribute, index) => {
        sentAttributes.push({
          label: requestedAttributes[selfAttestedAttributesKeys[index]].name,
          key: selfAttestedAttributesKeys[index],
          data: selfAttestedAttribute,
        })
      }
    )
  }
  return sentAttributes
}

export function convertProofSendToHistoryEvent(
  action: SendProofSuccessAction,
  {
    data: { name },
    originalProofRequestData: { requested_attributes },
    remotePairwiseDID: remoteDid,
  }: ProofRequestPayload,
  { requested_proof: { revealed_attrs, self_attested_attrs } }: Proof
): ConnectionHistoryEvent {
  return {
    action: HISTORY_EVENT_STATUS[SEND_PROOF_SUCCESS],
    data: mapSentAttributes(
      revealed_attrs,
      self_attested_attrs,
      requested_attributes
    ),
    id: uuid(),
    name,
    status: HISTORY_EVENT_STATUS[SEND_PROOF_SUCCESS],
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

export const deleteHistoryEvent = (
  historyEvent: ConnectionHistoryEvent
): DeleteHistoryEventAction => ({
  type: DELETE_HISTORY_EVENT,
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
  let historyEvent: ?ConnectionHistoryEvent = null

  try {
    if (event.type === INVITATION_RECEIVED) {
      historyEvent = convertInvitationToHistoryEvent(event.data.payload)
    }

    if (event.type === NEW_CONNECTION_SUCCESS) {
      historyEvent = convertConnectionSuccessToHistoryEvent(event)
    }

    if (event.type === SEND_CLAIM_REQUEST) {
      historyEvent = convertSendClaimRequestToHistoryEvent(event)
    }

    if (event.type === CLAIM_STORAGE_SUCCESS) {
      const claim: ClaimOfferPayload = yield select(
        getClaimOffer,
        event.messageId
      )
      historyEvent = convertClaimStorageSuccessToHistoryEvent(event, claim)

      const pendingHistory = yield select(getPendingHistoryEvent, claim)

      yield put(deleteHistoryEvent(pendingHistory))
    }

    if (event.type === PROOF_REQUEST_RECEIVED) {
      historyEvent = convertProofRequestToHistoryEvent(event)
    }

    if (event.type === SEND_PROOF_SUCCESS) {
      const proofRequest: ProofRequestPayload = yield select(
        getProofRequest,
        event.uid
      )
      const proof: ProofRequestPayload = yield select(getProof, event.uid)
      historyEvent = convertProofSendToHistoryEvent(event, proofRequest, proof)
    }

    if (historyEvent) {
      yield put(recordHistoryEvent(historyEvent))
    }
  } catch (e) {
    yield put(
      loadHistoryFail({
        ...ERROR_HISTORY_EVENT_OCCURRED,
        message: `${ERROR_HISTORY_EVENT_OCCURRED.message} ${e.message}`,
      })
    )
  }
}

export function* watchHistoryEventOccurred(): any {
  yield takeEvery(HISTORY_EVENT_OCCURRED, historyEventOccurredSaga)
}

export function* watchConnectionHistory(): any {
  yield all([watchLoadHistory(), watchHistoryEventOccurred()])
}

export default function connectionHistoryReducer(
  state: ConnectionHistoryStore = initialState,
  action: HistoryEventOccurredEventType
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
          ...merge(state.data, action.data),
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
            ...(state.data && state.data[remoteDid]
              ? state.data[remoteDid]
              : []),
            action.historyEvent,
          ],
        },
      }
    }

    case DELETE_HISTORY_EVENT: {
      const { remoteDid } = action.historyEvent
      const filteredData =
        state.data && state.data[remoteDid]
          ? state.data[remoteDid].filter(item => {
              return item !== action.historyEvent
            })
          : []
      return {
        ...state,
        data: {
          ...(state.data ? state.data : {}),
          [remoteDid]: filteredData,
        },
      }
    }

    case RESET:
      return initialState

    default:
      return state
  }
}

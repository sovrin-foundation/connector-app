// @flow
import {
  all,
  takeLatest,
  takeEvery,
  put,
  call,
  select,
} from 'redux-saga/effects'
import connectionHistoryReducer, {
  loadHistory,
  loadHistorySuccess,
  loadHistoryFail,
  loadHistorySaga,
  recordHistoryEvent,
  historyEventOccurred,
  historyEventOccurredSaga,
  convertInvitationToHistoryEvent,
  convertConnectionSuccessToHistoryEvent,
  convertClaimStorageSuccessToHistoryEvent,
  convertProofRequestToHistoryEvent,
  convertProofSendToHistoryEvent,
  convertSendClaimRequestToHistoryEvent,
  deleteHistoryEvent,
} from '../connection-history-store'
import { initialTestAction } from '../../common/type-common'
import {
  getTestInvitationPayload,
  successConnectionData,
  claimOffer,
  claimRequest,
  claim,
  claimOfferPayload,
  pendingClaimHistory,
  proofRequest,
  senderDid1,
  fulfilledRequestedAttributes,
  invitationReceivedEvent,
  newConnectionSuccessEvent,
  sendClaimRequestEvent,
  claimReceivedEvent,
  claimReceivedSuccessEvent,
  proofRequestReceivedEvent,
  proofRequestAutofillEvent,
  proofSharedEvent,
  proofRequestAutofill,
  proof,
  uid,
} from '../../../__mocks__/static-data'
import { invitationRejected } from '../../invitation/invitation-store'
import { saveNewConnection } from '../../store/connections-store'
import {
  claimOfferReceived,
  claimRequestSuccess,
} from '../../claim-offer/claim-offer-store'
import { claimReceived, claimStorageSuccess } from '../../claim/claim-store'
import { CLAIM_STORAGE_SUCCESS } from '../../claim/type-claim'
import {
  proofRequestReceived,
  sendProof,
  proofRequestAutoFill,
  sendProofSuccess,
} from '../../proof-request/proof-request-store'
import {
  HISTORY_EVENT_STORAGE_KEY,
  ERROR_LOADING_HISTORY,
  ERROR_HISTORY_EVENT_OCCURRED,
} from '../type-connection-history'
import {
  getProofRequest,
  getProof,
  getClaimOffer,
  getPendingHistoryEvent,
  getHistoryEvent,
  getPendingHistory,
  getClaimReceivedHistory,
} from '../../store/store-selector'
import { secureGet } from '../../services/storage'
import {
  CLAIM_OFFER_RECEIVED,
  SEND_CLAIM_REQUEST,
} from './../../claim-offer/type-claim-offer'
import { sendClaimRequest } from '../../claim-offer/claim-offer-store'
import { RESET } from '../../common/type-common'
import { PROOF_REQUEST_RECEIVED } from '../../proof-request/type-proof-request'

jest.mock('../../services/uuid')

function getHistoryData() {
  // generate history data from static data that we have

  const invitationGenerator = getTestInvitationPayload()
  const invitationPayload = invitationGenerator.next().value
  let sender1History = []
  if (invitationPayload) {
    // add history for connection request
    sender1History.push(
      convertInvitationToHistoryEvent(invitationPayload.payload)
    )
  }

  // add history for connection success
  sender1History.push(
    convertConnectionSuccessToHistoryEvent(
      saveNewConnection(successConnectionData)
    )
  )
  sender1History.push(
    convertSendClaimRequestToHistoryEvent(
      sendClaimRequest(uid, claimOfferPayload)
    )
  )

  // add history for proof request
  sender1History.push(
    convertProofRequestToHistoryEvent(
      proofRequestReceived(proofRequest.payload, proofRequest.payloadInfo)
    )
  )

  // add history for proof sent
  sender1History.push(
    convertProofSendToHistoryEvent(
      proofSharedEvent,
      proofRequestAutofill,
      proof
    )
  )

  return {
    [senderDid1]: sender1History,
  }
}

describe('Store: ConnectionHistory', () => {
  let initialState
  beforeEach(() => {
    initialState = connectionHistoryReducer(undefined, initialTestAction())
  })

  it('match loadHistory', () => {
    expect(
      connectionHistoryReducer(initialState, loadHistory())
    ).toMatchSnapshot()
  })

  it('match loadHistorySuccess', () => {
    expect(
      connectionHistoryReducer(
        initialState,
        loadHistorySuccess(getHistoryData())
      )
    ).toMatchSnapshot()
  })

  it('match loadHistoryFail', () => {
    expect(
      connectionHistoryReducer(
        initialState,
        loadHistoryFail({
          code: 'TEST 101',
          message: 'Load History failed',
        })
      )
    ).toMatchSnapshot()
  })

  it('match record history event', () => {
    expect(
      connectionHistoryReducer(
        initialState,
        recordHistoryEvent(
          convertSendClaimRequestToHistoryEvent(
            sendClaimRequest(uid, claimOfferPayload)
          )
        )
      )
    ).toMatchSnapshot()
  })

  it('historyEventOccurredSaga should raise success for correct invitation received ', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(invitationReceivedEvent)
    )
    historyEvent = convertInvitationToHistoryEvent(
      invitationReceivedEvent.data.payload
    )

    expect(gen.next().value).toEqual(put(recordHistoryEvent(historyEvent)))
  })

  it('historyEventOccurredSaga should raise success for correct new connection ', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(newConnectionSuccessEvent)
    )
    historyEvent = convertConnectionSuccessToHistoryEvent(
      newConnectionSuccessEvent
    )

    expect(gen.next().value).toEqual(put(recordHistoryEvent(historyEvent)))
  })

  it('historyEventOccurredSaga should raise success for sending claim request ', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(sendClaimRequestEvent)
    )
    historyEvent = convertSendClaimRequestToHistoryEvent(sendClaimRequestEvent)
    expect(gen.next().value).toEqual(
      select(
        getHistoryEvent,
        historyEvent.originalPayload.uid,
        historyEvent.remoteDid,
        CLAIM_OFFER_RECEIVED
      )
    )
    expect(gen.next().value).toEqual(
      select(
        getPendingHistory,
        historyEvent.originalPayload.uid,
        historyEvent.remoteDid,
        SEND_CLAIM_REQUEST
      )
    )

    expect(gen.next().value).toEqual(put(recordHistoryEvent(historyEvent)))
  })

  it('historyEventOccurredSaga should raise success for claim received ', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(claimReceivedSuccessEvent)
    )

    expect(gen.next().value).toEqual(
      select(getClaimOffer, claimReceivedSuccessEvent.messageId)
    )

    historyEvent = convertClaimStorageSuccessToHistoryEvent(
      claimReceivedSuccessEvent,
      claimOfferPayload
    )
    expect(gen.next(claimOfferPayload).value).toEqual(
      select(
        getClaimReceivedHistory,
        historyEvent.originalPayload.messageId,
        historyEvent.remoteDid,
        CLAIM_STORAGE_SUCCESS
      )
    )

    expect(gen.next().value).toEqual(
      select(getPendingHistoryEvent, claimOfferPayload)
    )
    expect(gen.next(pendingClaimHistory).value).toEqual(
      put(deleteHistoryEvent(pendingClaimHistory))
    )
  })

  it('historyEventOccurredSaga should raise success for correct proof request received', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(proofRequestReceivedEvent)
    )
    historyEvent = convertProofRequestToHistoryEvent(proofRequestReceivedEvent)
    expect(gen.next().value).toEqual(
      select(
        getHistoryEvent,
        historyEvent.originalPayload.payloadInfo.uid,
        historyEvent.remoteDid,
        PROOF_REQUEST_RECEIVED
      )
    )
    expect(gen.next().value).toEqual(put(recordHistoryEvent(historyEvent)))
  })

  it('historyEventOccurredSaga should raise success for proof shared', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(historyEventOccurred(proofSharedEvent))
    expect(gen.next().value).toEqual(
      select(getProofRequest, proofSharedEvent.uid)
    )
    expect(gen.next(proofRequestAutofill).value).toEqual(
      select(getProof, proofSharedEvent.uid)
    )
    historyEvent = convertProofSendToHistoryEvent(
      proofSharedEvent,
      proofRequestAutofill,
      proof
    )
  })

  it('historyEventOccurredSaga should raise failure in case anything fails', () => {
    const gen = historyEventOccurredSaga(historyEventOccurred(proofSharedEvent))
    expect(gen.next().value).toEqual(
      select(getProofRequest, proofSharedEvent.uid)
    )
    const error = new Error()
    expect(gen.throw(error).value).toEqual(
      put(
        loadHistoryFail({
          ...ERROR_HISTORY_EVENT_OCCURRED,
          message: `${ERROR_HISTORY_EVENT_OCCURRED.message} ${error.message}`,
        })
      )
    )
  })

  it('convertInvitationToHistoryEvent should raise success', () => {
    expect(
      convertInvitationToHistoryEvent(invitationReceivedEvent.data.payload)
    ).toMatchSnapshot()
  })

  it('convertConnectionSuccessToHistoryEvent should raise success', () => {
    expect(
      convertConnectionSuccessToHistoryEvent(newConnectionSuccessEvent)
    ).toMatchSnapshot()
  })

  it('convertConnectionSuccessToHistoryEvent should raise success', () => {
    expect(
      convertSendClaimRequestToHistoryEvent(sendClaimRequestEvent)
    ).toMatchSnapshot()
  })

  it('convertConnectionSuccessToHistoryEvent should raise success', () => {
    expect(
      convertConnectionSuccessToHistoryEvent(newConnectionSuccessEvent)
    ).toMatchSnapshot()
  })

  it('convertProofRequestToHistoryEvent should raise success', () => {
    expect(
      convertProofRequestToHistoryEvent(proofRequestReceivedEvent)
    ).toMatchSnapshot()
  })

  it('convertProofAutoFillToHistoryEvent should raise success', () => {
    expect(
      convertProofSendToHistoryEvent(
        proofSharedEvent,
        proofRequestAutofill,
        proof
      )
    ).toMatchSnapshot()
  })

  it('should raise failure in case data secureGet fails', () => {
    const gen = loadHistorySaga()
    gen.next()
    expect(gen.next().value).toEqual(call(secureGet, HISTORY_EVENT_STORAGE_KEY))
    const error = new Error()
    expect(gen.throw(error).value).toEqual(
      put(
        loadHistoryFail({
          ...ERROR_LOADING_HISTORY,
          message: `${ERROR_LOADING_HISTORY.message} ${error.message}`,
        })
      )
    )
    expect(gen.next().done).toBe(true)
  })

  it('should reset history if RESET action is raised', () => {
    const afterOneHistoryEventState = connectionHistoryReducer(
      initialState,
      recordHistoryEvent(
        convertSendClaimRequestToHistoryEvent(
          sendClaimRequest(uid, claimOfferPayload)
        )
      )
    )
    expect(
      connectionHistoryReducer(afterOneHistoryEventState, {
        type: RESET,
      })
    ).toMatchSnapshot()
  })
})

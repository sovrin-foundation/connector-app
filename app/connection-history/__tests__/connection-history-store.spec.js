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
  convertClaimReceivedToHistoryEvent,
  convertProofRequestToHistoryEvent,
  convertProofAutoFillToHistoryEvent,
  convertSendClaimRequestToHistoryEvent,
} from '../connection-history-store'
import { initialTestAction } from '../../common/type-common'
import {
  getTestInvitationPayload,
  successConnectionData,
  claimOffer,
  claimRequest,
  claim,
  proofRequest,
  senderDid1,
  fulfilledRequestedAttributes,
} from '../../../__mocks__/static-data'
import { invitationRejected } from '../../invitation/invitation-store'
import { saveNewConnection } from '../../store/connections-store'
import {
  claimOfferReceived,
  claimRequestSuccess,
} from '../../claim-offer/claim-offer-store'
import { claimReceived } from '../../claim/claim-store'
import {
  proofRequestReceived,
  sendProof,
  proofRequestAutoFill,
} from '../../proof-request/proof-request-store'
import {
  HISTORY_EVENT_STORAGE_KEY,
  ERROR_LOADING_HISTORY,
  ERROR_HISTORY_EVENT_OCCURRED,
} from '../type-connection-history'
import { getProofRequest, getClaimOffer } from '../../store/store-selector'
import { getItem } from '../../services/secure-storage'
import { sendClaimRequest } from '../../claim-offer/claim-offer-store'
import {
  invitationReceivedEvent,
  newConnectionSuccessEvent,
  sendClaimRequestEvent,
  claimReceivedEvent,
  proofRequestReceivedEvent,
  proofRequestAutofillEvent,
  proofRequestAutofill,
  claimOfferPayload,
  uid,
} from '../../../__mocks__/static-data'
import { RESET } from '../../common/type-common'

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
    convertProofAutoFillToHistoryEvent(
      proofRequestAutoFill(
        proofRequest.payloadInfo.uid,
        fulfilledRequestedAttributes
      ),
      proofRequest.payload.data.name,
      proofRequest.payloadInfo.remotePairwiseDID
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
    expect(gen.next().value).toEqual(put(recordHistoryEvent(historyEvent)))
  })

  //TODO : fix this test
  xit('historyEventOccurredSaga should raise success for claim received ', () => {})

  it('historyEventOccurredSaga should raise success for correct proof request received', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(proofRequestReceivedEvent)
    )
    historyEvent = convertProofRequestToHistoryEvent(proofRequestReceivedEvent)
    expect(gen.next().value).toEqual(put(recordHistoryEvent(historyEvent)))
  })

  it('historyEventOccurredSaga should raise success for proof autofill', () => {
    let historyEvent
    const gen = historyEventOccurredSaga(
      historyEventOccurred(proofRequestAutofillEvent)
    )
    expect(gen.next().value).toEqual(
      select(getProofRequest, proofRequestAutofillEvent.uid)
    )
    historyEvent = convertProofAutoFillToHistoryEvent(
      proofRequestAutofillEvent,
      proofRequestAutofill.originalProofRequestData.name,
      proofRequestAutofill.remotePairwiseDID
    )
  })

  it('historyEventOccurredSaga should raise failure in case anything fails', () => {
    const gen = historyEventOccurredSaga(
      historyEventOccurred(proofRequestAutofillEvent)
    )
    expect(gen.next().value).toEqual(
      select(getProofRequest, proofRequestAutofillEvent.uid)
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

  //TODO : fix this test
  xit('convertConnectionSuccessToHistoryEvent should raise success', () => {})

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
      convertProofAutoFillToHistoryEvent(
        proofRequestAutofillEvent,
        proofRequestAutofill.originalProofRequestData.name,
        proofRequestAutofill.remotePairwiseDID
      )
    ).toMatchSnapshot()
  })

  it('should raise failure in case data getItem fails', () => {
    const gen = loadHistorySaga()
    expect(gen.next().value).toEqual(call(getItem, HISTORY_EVENT_STORAGE_KEY))
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
      connectionHistoryReducer(afterOneHistoryEventState, { type: RESET })
    ).toMatchSnapshot()
  })
})

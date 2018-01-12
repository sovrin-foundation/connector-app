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
  convertClaimOfferToHistoryEvent,
  convertProofRequestToHistoryEvent,
  convertProofAutoFillToHistoryEvent,
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

  // add history for claim offer
  sender1History.push(
    convertClaimOfferToHistoryEvent(
      claimOfferReceived(claimOffer.payload, claimOffer.payloadInfo)
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

  xit('loadHistorySaga should raise success for correct data', () => {
    // TODO:KS Fix this test
  })

  xit('should raise failure in case data getItem fails', () => {
    // TODO:KS Fix this test
  })
})

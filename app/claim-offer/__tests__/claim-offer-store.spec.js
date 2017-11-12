// @flow
import { put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import claimOfferStore, {
  claimOfferReceived,
  claimOfferShown,
  claimOfferIgnored,
  claimOfferRejected,
  sendClaimRequest,
  claimRequestSuccess,
  claimRequestFail,
  claimOfferAccepted,
  acceptClaimOffer,
} from '../claim-offer-store'
import { CLAIM_OFFER_ACCEPTED } from '../type-claim-offer'
import { INITIAL_TEST_ACTION } from '../../common/type-common'
import type { ClaimOfferAcceptedAction } from '../type-claim-offer'

describe('claim offer store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState = {}
  let newState = {}
  const uid = 'usd123'

  const claimOffer = {
    payload: {
      data: {
        name: 'Home Address',
        version: '1.0.0',
        revealedAttributes: [
          {
            label: 'Address 1',
            data: 'Address Address Address',
          },
          {
            label: 'Address 2',
            data: 'Address 2 Address 2 Address 2',
          },
        ],
      },
      issuer: {
        name: 'Test Issuer',
      },
      statusMsg: 'pending',
    },
    payloadInfo: {
      uid: 'usd123',
      senderLogoUrl: 'http://testissuer.com/logoUrl.png',
      remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
    },
  }

  beforeEach(() => {
    initialState = claimOfferStore(undefined, initialAction)
  })

  it('should correctly calculate initial state', () => {
    expect(initialState).toMatchSnapshot()
  })

  it('claim offer is received', () => {
    newState = claimOfferStore(
      initialState,
      claimOfferReceived(claimOffer.payload, claimOffer.payloadInfo)
    )
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is shown', () => {
    newState = claimOfferStore(newState, claimOfferShown(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is ignored', () => {
    newState = claimOfferStore(newState, claimOfferIgnored(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is rejected', () => {
    newState = claimOfferStore(newState, claimOfferRejected(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is accepted', () => {
    newState = claimOfferStore(newState, acceptClaimOffer(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request is sent', () => {
    newState = claimOfferStore(newState, sendClaimRequest(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request is success', () => {
    newState = claimOfferStore(newState, claimRequestSuccess(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request is fail', () => {
    newState = claimOfferStore(newState, claimRequestFail(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request saga works fine after claim offer is accepted', () => {
    const gen = claimOfferAccepted(acceptClaimOffer(uid))
    expect(gen.next().value).toMatchObject(put(sendClaimRequest(uid)))
    expect(gen.next().value).toMatchObject(call(delay, 2000))
    expect(gen.next().value).toMatchObject(put(claimRequestSuccess(uid)))
    expect(gen.next().done).toBe(true)
  })
})

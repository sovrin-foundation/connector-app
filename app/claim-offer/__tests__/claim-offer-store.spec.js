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
import type { ClaimOfferAcceptedAction } from '../type-claim-offer'

describe('claim offer store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState
  beforeEach(() => {
    initialState = claimOfferStore(undefined, initialAction)
  })

  it('should correctly calculate initial state', () => {
    expect(initialState).toMatchSnapshot()
  })

  it('claim offer is received', () => {
    const claimOffer = {
      claimOffer: {
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
        logoUrl: 'http://testissuer.com/logoUrl.png',
        pairwiseDID: 'ha66899sadfjZJGINKN0770',
      },
    }
    expect(
      claimOfferStore(initialState, claimOfferReceived(claimOffer))
    ).toMatchSnapshot()
  })

  it('claim offer is shown', () => {
    expect(claimOfferStore(initialState, claimOfferShown())).toMatchSnapshot()
  })

  it('claim offer is ignored', () => {
    expect(claimOfferStore(initialState, claimOfferIgnored())).toMatchSnapshot()
  })

  it('claim offer is rejected', () => {
    expect(
      claimOfferStore(initialState, claimOfferRejected())
    ).toMatchSnapshot()
  })

  it('claim offer is accepted', () => {
    expect(claimOfferStore(initialState, acceptClaimOffer())).toMatchSnapshot()
  })

  it('claim request is sent', () => {
    expect(claimOfferStore(initialState, sendClaimRequest())).toMatchSnapshot()
  })

  it('claim request is success', () => {
    expect(
      claimOfferStore(initialState, claimRequestSuccess())
    ).toMatchSnapshot()
  })

  it('claim request is fail', () => {
    expect(claimOfferStore(initialState, claimRequestFail())).toMatchSnapshot()
  })

  it('claim request saga works fine after claim offer is accepted', () => {
    const gen = claimOfferAccepted(acceptClaimOffer())
    expect(gen.next().value).toMatchObject(put(sendClaimRequest()))
    expect(gen.next().value).toMatchObject(call(delay, 3000))
    expect(gen.next().value).toMatchObject(put(claimRequestSuccess()))
  })
})

// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { ClaimOffer } from '../claim-offer'
import { CLAIM_OFFER_STATUS, CLAIM_REQUEST_STATUS } from '../type-claim-offer'

describe('<ClaimOffer />', () => {
  let wrapper
  let claimOfferShown
  let acceptClaimOffer
  let claimOfferRejected
  let claimOfferIgnored
  let tree
  let navigation
  const claimOffer = {
    status: CLAIM_OFFER_STATUS.RECEIVED,
    payload: {
      claimOffer: {
        name: 'Home Address',
        version: '1.0.0',
        revealedAttributes: [
          {
            label: 'Address 1',
            data: 'An Address',
          },
          {
            label: 'Address 2',
            data: 'An Address 2',
          },
        ],
      },
      issuer: {
        name: 'Test Issuer',
        logoUrl: 'http://testissuer.com/logoUrl.png',
        pairwiseDID: 'ha66899sadfjZJGINKN0770',
      },
    },
    claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
  }
  beforeEach(() => {
    claimOfferShown = jest.fn()
    acceptClaimOffer = jest.fn()
    claimOfferRejected = jest.fn()
    claimOfferIgnored = jest.fn()
    navigation = {
      goBack: jest.fn(),
    }
    wrapper = renderer.create(
      <ClaimOffer
        claimOffer={claimOffer}
        claimOfferShown={claimOfferShown}
        acceptClaimOffer={acceptClaimOffer}
        claimOfferIgnored={claimOfferIgnored}
        claimOfferRejected={claimOfferRejected}
        navigation={navigation}
      />
    )
    tree = wrapper.toJSON()
  })

  it('should call claimOfferShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(claimOfferShown).toHaveBeenCalled()
  })

  it('should call acceptClaimOffer if offer is accepted', () => {
    wrapper.getInstance().onAccept()
    expect(acceptClaimOffer).toHaveBeenCalled()
  })

  it('should call claimOfferIgnored if close button is pressed', () => {
    wrapper.getInstance().onIgnore()
    expect(claimOfferIgnored).toHaveBeenCalled()
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('should call claimOfferRejected if ignore button is pressed', () => {
    wrapper.getInstance().onReject()
    expect(claimOfferRejected).toHaveBeenCalled()
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

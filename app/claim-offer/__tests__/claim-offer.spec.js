// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { ClaimOffer } from '../claim-offer'

describe('<ClaimOffer />', () => {
  it('should call claimOfferShown', () => {
    const claimOfferShown = jest.fn()
    const wrapper = renderer
      .create(<ClaimOffer claimOfferShown={claimOfferShown} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
    expect(claimOfferShown).toHaveBeenCalled()
  })
})

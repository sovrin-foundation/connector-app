// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import ClaimRequestModal from '../claim-request-modal'
import { CLAIM_REQUEST_STATUS } from '../type-claim-offer'
import {
  claimOfferPayload,
  senderLogoUrl,
} from '../../../__mocks__/static-data'

describe('<ClaimRequestModal />', () => {
  const onContinue = jest.fn()

  it('should match snapshot', () => {
    const wrapper = renderer
      .create(
        <ClaimRequestModal
          claimRequestStatus={CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST}
          payload={claimOfferPayload}
          onContinue={onContinue}
          senderLogoUrl={senderLogoUrl}
        />
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot when pending popOver', () => {
    const wrapper = renderer
      .create(
        <ClaimRequestModal
          claimRequestStatus={CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST}
          payload={claimOfferPayload}
          onContinue={onContinue}
          senderLogoUrl={senderLogoUrl}
          isPending={true}
        />
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

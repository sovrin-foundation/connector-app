// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import ClaimRequestModal from '../claim-request-modal'
import { CLAIM_REQUEST_STATUS } from '../type-claim-offer'

describe('<ClaimRequestModal />', () => {
  it('should match snapshot', () => {
    const payload = {
      data: {
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
        claimDefinitionSchemaSequenceNumber: 36,
      },
      issuer: {
        name: 'Test Issuer',
        did: 'issuerDid',
      },
      statusMsg: 'pending',
      remotePairwiseDID: 'remotePairwiseDID',
      uid: 'asd123',
      status: 'SHOWN',
      claimRequestStatus: 'NONE',
    }
    const senderLogoUrl = 'http://testissuer.com/logoUrl.png'
    const onContinue = jest.fn()
    const wrapper = renderer
      .create(
        <ClaimRequestModal
          claimRequestStatus={CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST}
          payload={payload}
          onContinue={onContinue}
          senderLogoUrl={senderLogoUrl}
        />
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

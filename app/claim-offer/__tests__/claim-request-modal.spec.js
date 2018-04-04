// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import ClaimRequestModal from '../claim-request-modal'
import { CLAIM_REQUEST_STATUS } from '../type-claim-offer'
import {
  claimOfferPayload,
  senderLogoUrl,
  getStore,
} from '../../../__mocks__/static-data'

describe('<ClaimRequestModal />', () => {
  const onContinue = jest.fn()
  const store = getStore()

  it('should match snapshot', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ClaimRequestModal
            claimRequestStatus={CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST}
            payload={claimOfferPayload}
            onContinue={onContinue}
            senderLogoUrl={senderLogoUrl}
            message1="You accepted "
            message3=" from "
            message5="!"
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot when pending popOver', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ClaimRequestModal
            claimRequestStatus={CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST}
            payload={claimOfferPayload}
            onContinue={onContinue}
            senderLogoUrl={senderLogoUrl}
            isPending={true}
            message1="As soon as "
            message3=" signs and issues "
            message5=" to you it will appear here"
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

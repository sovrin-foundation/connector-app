// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { homeTabRoute } from '../../common'
import { PushNotificationNavigator } from '../push-notification-navigator'
import {
  convertClaimOfferPushPayloadToAppClaimOffer,
  convertClaimPushPayloadToAppClaim,
  convertProofRequestPushPayloadToAppProofRequest,
} from '../push-notification-store'
import {
  claimOfferPushNotification,
  proofRequestPushPayloadAdditionalData,
} from '../../../__mocks__/static-data'

describe('<PushNotificationNavigator />', () => {
  let store = {}

  const storeToProps = {
    pushNotification: {
      notification: claimOfferPushNotification,
      navigateRoute: null,
    },
  }

  beforeAll(() => {
    store = {
      getState() {
        return {
          ...storeToProps,
        }
      },
      subscribe() {
        return jest.fn()
      },
      dispatch() {
        return jest.fn()
      },
    }
  })

  function props() {
    return {
      ...storeToProps,
      updatePayloadToRelevantStoreAndRedirect: jest.fn(),
      clearNavigateToRoutePN: jest.fn(),
      navigateToRoute: jest.fn(),
    }
  }

  it('should render PushNotification Navigator components properly', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <PushNotificationNavigator {...props()} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

describe('convertProofRequestPushPayloadToAppProofRequest', () => {
  it('should convert push payload to proof request format correctly', () => {
    expect(
      convertProofRequestPushPayloadToAppProofRequest(
        proofRequestPushPayloadAdditionalData
      )
    ).toMatchSnapshot()
  })
})

describe('convertClaimPushPayloadToAppClaim', () => {
  it('should match snapshot', () => {
    const claimPushPayload = {
      msg_type: 'claim',
      version: '0.1',
      claim_offer_id: '7TNw2k5',
      from_did: '3KFuh4jmMC5Agsy5HcCwFB',
      to_did: '5RHwxmBrGxaEskHcBnLKve',
      claim: { name: ['Test', '12'] },
      schema_seq_no: 12,
      issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      signature: { primary_claim: { m2: 'm2', a: 'a', e: 'e', v: 'v' } },
    }
    const claim = convertClaimPushPayloadToAppClaim(
      claimPushPayload,
      '1',
      claimPushPayload.to_did
    )
    expect(claim).toMatchSnapshot()
  })
})

describe('convertClaimOfferPushPayloadToAppClaimOffer', () => {
  it('should convert push payload to claim offer format correctly', () => {
    const claimOfferPushPayload = {
      msg_type: 'CLAIM_OFFER',
      version: '0.1',
      to_did: 'BnRXf8yDMUwGyZVDkSENeq',
      from_did: 'GxtnGN6ypZYgEqcftSQFnC',
      iid: 'cCanHnpFAD',
      mid: '',
      claim: {
        name: ['Alice'],
        date_of_birth: ['2000-05-17'],
        height: ['175'],
      },
      schema_seq_no: 12,
      issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      nonce: '351590',
      claim_name: 'Profile detail',
      issuer_name: 'Test Enterprise',
      optional_data: { terms_of_service: '<Large block of text>', price: 6 },
      remoteName: 'Test remote name',
    }

    expect(
      convertClaimOfferPushPayloadToAppClaimOffer(claimOfferPushPayload)
    ).toMatchSnapshot()
  })
})

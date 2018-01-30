// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { homeTabRoute } from '../../common'
import {
  PushNotificationNavigator,
  convertClaimOfferPushPayloadToAppClaimOffer,
  convertClaimPushPayloadToAppClaim,
  convertProofRequestPushPayloadToAppProofRequest,
} from '../push-notification-navigator'

describe('<PushNotificationNavigator />', () => {
  let store = {}

  const storeToProps = {
    pushNotification: {
      notification: {
        additionalData: {
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
            did: 'issuerDid',
          },
          statusMsg: 'pending',
        },
        type: 'claimOffer',
        uid: 'usd123',
        senderLogoUrl: 'http://testissuer.com/logoUrl.png',
        remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
        forDID: 'forDID',
      },
    },
    currentScreen: homeTabRoute,
    isAppLocked: false,
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
      navigateToRoute: jest.fn(),
      fetchAdditionalData: jest.fn(),
      authenticationRequestReceived: jest.fn(),
      claimOfferReceived: jest.fn(),
      proofRequestReceived: jest.fn(),
      pushNotificationReceived: jest.fn(),
      addPendingRedirection: jest.fn(),
      claimReceived: jest.fn(),
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
    const proofRequestPushPayload = {
      '@type': {
        name: 'PROOF_REQUEST',
        version: '1.0',
      },
      '@topic': {
        tid: 1,
        mid: 9,
      },
      intended_use: 'Verify Home Address',
      proof_request_data: {
        nonce: '123432421212',
        name: 'Home Address',
        version: '0.1',
        requested_attrs: {
          '<attr1_uuid>': {
            name: 'your_name',
          },
          '<attr2_uuid>': {
            schema_seq_no: 1,
            name: 'address_1',
          },
          '<attr3_uuid>': {
            schema_seq_no: 2,
            issuer_did: 'ISSUER_DID2',
            name: 'address_2',
          },
          '<attr4_uuid>': {
            schema_seq_no: 1,
            name: 'city',
          },
          '<attr5_uuid>': {
            schema_seq_no: 1,
            name: 'state',
          },
          '<attr6_uuid>': {
            schema_seq_no: 1,
            name: 'zip',
          },
        },
        requested_predicates: {
          predicate1_uuid: {
            attr_name: 'age',
            p_type: 'GE',
            value: 18,
            schema_seq_no: 1,
            issuer_did: 'DID1',
          },
        },
      },
      remoteName: 'Evernym',
    }

    expect(
      convertProofRequestPushPayloadToAppProofRequest(proofRequestPushPayload)
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

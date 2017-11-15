// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { homeTabRoute } from '../../common'
import {
  PushNotificationNavigator,
  convertClaimOfferPushPayloadToAppClaimOffer,
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
    }
  }

  it('should render PushNotification components properly', () => {
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
    }

    expect(
      convertClaimOfferPushPayloadToAppClaimOffer(claimOfferPushPayload)
    ).toMatchSnapshot()
  })
})

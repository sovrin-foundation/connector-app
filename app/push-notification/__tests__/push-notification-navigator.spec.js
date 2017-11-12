// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { homeTabRoute } from '../../common'
import { PushNotificationNavigator } from '../push-notification-navigator'

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

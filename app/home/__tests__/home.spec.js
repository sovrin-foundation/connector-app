// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { CLAIM_OFFER_STATUS } from '../../claim-offer/type-claim-offer'
import {
  claimOfferRoute,
  homeTabRoute,
  authenticationRoute,
} from '../../common'
import {
  MESSAGE_TYPE,
  PUSH_NOTIFICATION_SENT_CODE,
} from '../../api/api-constants'
import { DashboardScreen } from '../home'
import {
  getNavigation,
  getStore,
  myPairWiseConnectionDetails,
  vcxSerializedConnection,
} from '../../../__mocks__/static-data'

function props(claimOfferStatus, noConnections) {
  let connectionsData = {
    '3nj819kkjywdppuje79': {
      identifier: '3nj819kkjywdppuje79',
      name: 'Test Connection',
      senderDID: '70075yyojywdppuje79',
      senderEndpoint: '34.216.340.155:3000',
      size: 100,
      logoUrl: 'https://logourl.com/logo.png',
      vcxSerializedConnection,
      ...myPairWiseConnectionDetails,
    },
  }

  if (noConnections) {
    connectionsData = {}
  }

  return {
    connections: {
      data: connectionsData,
      hydrated: true,
    },
    navigation: getNavigation(),
    claimOfferStatus: claimOfferStatus || CLAIM_OFFER_STATUS.RECEIVED,
    route: {
      currentScreen: homeTabRoute,
    },
    pushNotification: {
      notification: null,
    },
    getUserInfo: jest.fn(),
    pushNotificationReceived: jest.fn(),
    authenticationRequestReceived: jest.fn(),
    unSeenMessages: {},
  }
}

describe('<DashboardScreen />', () => {
  const store = getStore()

  jest.useFakeTimers()
  it('should render Home and redirect user to claim offer modal', () => {
    const dashboardProps = props(false, true)
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <DashboardScreen {...dashboardProps} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Home and show loader', () => {
    const dashboardProps = props(false, true)
    dashboardProps.connections.hydrated = false
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <DashboardScreen {...dashboardProps} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Home and show introductory text', () => {
    const dashboardProps = props(false, false)
    dashboardProps.connections.data = {}
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <DashboardScreen {...dashboardProps} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

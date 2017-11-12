// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { CLAIM_OFFER_STATUS } from '../../claim-offer/type-claim-offer'
import {
  claimOfferRoute,
  homeTabRoute,
  authenticationRoute,
} from '../../common'
import {
  PUSH_NOTIFICATION_TYPE,
  PUSH_NOTIFICATION_SENT_CODE,
} from '../../services/api'
import { DashboardScreen } from '../home'

function props(claimOfferStatus) {
  return {
    connections: {
      data: {
        '3nj819kkjywdppuje79': {
          identifier: '3nj819kkjywdppuje79',
          name: 'Test Connection',
          remoteConnectionId: '70075yyojywdppuje79',
          size: 100,
          logoUrl: { uri: 'https://logourl.com/logo.png' },
        },
      },
    },
    navigation: {
      navigate: jest.fn(),
    },
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
  }
}

describe('<DashboardScreen />', () => {
  jest.useFakeTimers()

  it('should render Home and redirect user to claim offer modal', () => {
    const dashboardProps = props()
    const wrapper = renderer
      .create(<DashboardScreen {...dashboardProps} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  // TODO:PS: Fix this while working on authentication flow
  // Need to check with authentication as Push notification flow has changes

  // it('should redirect to authentication screen if push is received', () => {
  //   const dashboardProps = props(CLAIM_OFFER_STATUS.IDLE)
  //   const instance = renderer
  //     .create(<DashboardScreen {...dashboardProps} />)
  //     .getInstance()
  //   const nextProps = {
  //     ...dashboardProps,
  //     pushNotification: {
  //       notification: {
  //         type: PUSH_NOTIFICATION_TYPE.AUTH,
  //         authNotifMsgTitle: 'Test title',
  //         authNotifMsgText: 'Test authentication request message',
  //         logoUrl: 'https://logourl.com/logoUrl.png',
  //         remoteConnectionId: '70075yyojywdppuje79',
  //       },
  //     },
  //   }
  //   instance.componentWillReceiveProps(nextProps)
  //   const { notification } = nextProps.pushNotification
  //   expect(nextProps.authenticationRequestReceived).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       offerMsgTitle: notification && notification.authNotifMsgTitle,
  //       offerMsgText: notification && notification.authNotifMsgText,
  //       statusCode: PUSH_NOTIFICATION_SENT_CODE,
  //       logoUrl: notification && notification.logoUrl,
  //       remoteConnectionId: notification && notification.remoteConnectionId,
  //     })
  //   )
  //   expect(nextProps.navigation.navigate).toHaveBeenCalledWith(
  //     authenticationRoute
  //   )
  //   expect(nextProps.pushNotificationReceived).toHaveBeenCalledWith(null)
  // })

  // it('should redirect to claim offer screen if push is received', () => {
  //   const dashboardProps = props(CLAIM_OFFER_STATUS.IDLE)
  //   const instance = renderer
  //     .create(<DashboardScreen {...dashboardProps} />)
  //     .getInstance()
  //   const nextProps = {
  //     ...dashboardProps,
  //     pushNotification: {
  //       notification: {
  //         type: PUSH_NOTIFICATION_TYPE.CLAIM_OFFER,
  //       },
  //     },
  //   }
  //   instance.componentWillReceiveProps(nextProps)
  //   expect(nextProps.navigation.navigate).toHaveBeenCalledWith(claimOfferRoute)
  // })
})

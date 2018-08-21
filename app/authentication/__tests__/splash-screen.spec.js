// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import {
  splashScreenRoute,
  homeRoute,
  waitForInvitationRoute,
  invitationRoute,
} from '../../common/'
import { PUSH_NOTIFICATION_SENT_CODE } from '../../api/api-constants'
import {
  default as connectedSplashScreen,
  SplashScreenView,
} from '../splash-screen'
import { color } from '../../common/styles'
import SplashScreen from 'react-native-splash-screen'
import {
  getNavigation,
  getStore,
  getSmsPendingInvitationOfToken,
  senderDid1,
} from '../../../__mocks__/static-data'
import { DEEP_LINK_STATUS } from '../../deep-link/type-deep-link'

describe('<SplashScreen />', () => {
  function getProps(overrideProps = {}) {
    const getLock = () => {
      const { lock } = getStore().getState()
      return lock
    }
    // TODO: We have to fix the problem in getStore function, we should be just able to pass an object and
    // TODO: it should deep extend default store state. We can't do these many calls for getStore and getState
    // TODO: for any property that we want to override
    const store = getStore({
      ...getStore().getState(),
      lock: { ...getLock(), isAppLocked: true },
    })
    const {
      deepLink,
      config,
      lock,
      smsPendingInvitation,
      eula,
    } = store.getState()
    const props = {
      navigation: getNavigation(),
      deepLink,
      isInitialized: config.isInitialized,
      lock,
      eula,
      smsPendingInvitation,
      addPendingRedirection: jest.fn(),
      getSmsPendingInvitation: jest.fn(),
      safeToDownloadSmsInvitation: jest.fn(),
      deepLinkProcessed: jest.fn(),
      ...overrideProps,
    }

    return { store, props }
  }

  function setup() {
    const { store, props } = getProps()
    const component = renderer.create(<SplashScreenView {...props} />)
    const instance = component.root.instance

    return { store, props, component, instance }
  }

  it('should match snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should add home route to pending redirection if deepLink is empty', () => {
    const { component, props } = setup()
    const { deepLink, addPendingRedirection } = props
    component.update(
      <SplashScreenView
        {...props}
        deepLink={{ ...deepLink, isLoading: false }}
      />
    )
    expect(addPendingRedirection).toHaveBeenCalledWith([
      { routeName: homeRoute },
    ])
  })

  it('should go To homeRoute if deepLink is empty and app was unlocked', () => {
    const { component, props } = setup()
    const { deepLink, navigation, addPendingRedirection, lock } = props
    component.update(
      <SplashScreenView
        {...props}
        lock={{ ...lock, isAppLocked: false }}
        deepLink={{ ...deepLink, isLoading: false }}
      />
    )
    expect(navigation.navigate).toHaveBeenCalledWith(homeRoute)
  })

  it(`should goto 'waitForInvitation' screen and fetch invitation if a deepLink was found and app was unlocked`, () => {
    const { component, props } = setup()
    const { deepLink, getSmsPendingInvitation, lock, navigation } = props
    const updatedDeepLink = {
      ...deepLink,
      isLoading: false,
      tokens: {
        token1: {
          status: DEEP_LINK_STATUS.NONE,
          token: 'token1',
          error: null,
        },
      },
    }
    component.update(
      <SplashScreenView
        {...props}
        deepLink={updatedDeepLink}
        lock={{ ...lock, isAppLocked: false }}
      />
    )
    expect(getSmsPendingInvitation).toHaveBeenCalledWith('token1')
    expect(navigation.navigate).toHaveBeenCalledWith(waitForInvitationRoute)
  })

  it(`should show invitation if invitation is fetched and app is unlocked`, () => {
    const { component, props } = setup()
    const { deepLink, deepLinkProcessed, lock, navigation } = props
    const updatedDeepLink = {
      ...deepLink,
      isLoading: false,
      tokens: {
        '3651947c': {
          status: DEEP_LINK_STATUS.NONE,
          token: '3651947c',
          error: null,
        },
      },
    }
    const smsPendingInvitation = getSmsPendingInvitationOfToken('3651947c')
    component.update(
      <SplashScreenView
        {...props}
        deepLink={updatedDeepLink}
        lock={{ ...lock, isAppLocked: false }}
        smsPendingInvitation={smsPendingInvitation}
      />
    )
    expect(deepLinkProcessed).toHaveBeenCalledWith('3651947c')
    expect(navigation.navigate).toHaveBeenCalledWith(invitationRoute, {
      senderDID: senderDid1,
      token: '3651947c',
    })
  })

  it(`should add invitation route to pending redirection if invitation is fetched and app is locked`, () => {
    const { component, props } = setup()
    const {
      deepLink,
      deepLinkProcessed,
      addPendingRedirection,
      lock,
      navigation,
    } = props
    const updatedDeepLink = {
      ...deepLink,
      isLoading: false,
      tokens: {
        '3651947c': {
          status: DEEP_LINK_STATUS.NONE,
          token: '3651947c',
          error: null,
        },
      },
    }
    const smsPendingInvitation = getSmsPendingInvitationOfToken('3651947c')
    component.update(
      <SplashScreenView
        {...props}
        deepLink={updatedDeepLink}
        lock={{ ...lock, isAppLocked: true }}
        smsPendingInvitation={smsPendingInvitation}
      />
    )
    expect(deepLinkProcessed).toHaveBeenCalledWith('3651947c')
    expect(addPendingRedirection).toHaveBeenCalledWith([
      {
        routeName: invitationRoute,
        params: { senderDID: senderDid1, token: '3651947c' },
      },
    ])
  })
})

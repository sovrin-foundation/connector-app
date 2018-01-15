// @flow
import React from 'react'
import { StyleSheet } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import AuthenticationScreen from './authentication/authentication'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './authentication/splash-screen'
import { Settings } from './settings'
import ExpiredTokenScreen from './expired-token/expired-token'
import QRCodeScanner from './qr-code/qr-code'
import LockSelectionScreen from './lock/lock-selection'
import LockEnterPinScreen from './lock/lock-enter-pin-code'
import LockTouchIdSetupScreen from './lock/lock-fingerprint-setup'
import LockPinCodeSetupScreen from './lock/lock-pin-code-setup'
import LockSetupSuccessScreen from './lock/lock-setup-success'
import LockEnterFingerprintScreen from './lock/lock-enter-fingerprint'
import ClaimOffer from './claim-offer/claim-offer'
import ProofRequestScreen from './proof-request/proof-request'
import InvitationScreen from './invitation/invitation'
import ConnectionHistoryScreen from './connection-history/connection-history'
import ConnectionHistoryDetailsScreen from './connection-history/connection-history-details'
import SwitchEnvironmentScreen from './switch-environment/switch-environment'
import { LockAuthorization } from './lock/lock-authorization'
import { Icon } from './components'
import {
  splashScreenRoute,
  homeRoute,
  authenticationRoute,
  connectionRoute,
  connectionHistoryRoute,
  expiredTokenRoute,
  lockEnterPinRoute,
  lockSelectionRoute,
  lockPinSetupRoute,
  lockTouchIdSetupRoute,
  lockSetupSuccessRoute,
  lockEnterFingerprintRoute,
  claimOfferRoute,
  homeTabRoute,
  settingsTabRoute,
  qrCodeScannerTabRoute,
  proofRequestRoute,
  invitationRoute,
  connectionHistoryDetailsRoute,
  switchEnvironmentRoute,
  lockAuthorizationRoute,
} from './common/'
import { color } from './common/styles'

if (__DEV__) {
  require('../tools/reactotron-config')
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: color.bg.tertiary.color,
    borderTopWidth: 0,
  },
})

const Tabs = TabNavigator(
  {
    [homeTabRoute]: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          return focused ? (
            <Icon src={require('./images/dashboard_large.png')} mediumLarge />
          ) : (
            <Icon src={require('./images/dashboard.png')} medium />
          )
        },
      },
    },
    [settingsTabRoute]: {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          return focused ? (
            <Icon src={require('./images/settings_large.png')} mediumLarge />
          ) : (
            <Icon src={require('./images/settings.png')} medium />
          )
        },
      },
    },
    [qrCodeScannerTabRoute]: {
      screen: QRCodeScanner,
      navigationOptions: {
        tabBarVisible: false,
        tabBarIcon: () => {
          return <Icon src={require('./images/addConnection.png')} medium />
        },
      },
    },
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    lazy: true,
    initialRouteName: homeTabRoute,
    order: [settingsTabRoute, homeTabRoute, qrCodeScannerTabRoute],
    tabBarOptions: {
      showLabel: false,
      style: styles.tabBarContainer,
    },
  }
)

const CardStack = StackNavigator(
  {
    [splashScreenRoute]: {
      screen: SplashScreenView,
    },
    [homeRoute]: {
      screen: Tabs,
    },
    [authenticationRoute]: {
      screen: AuthenticationScreen,
    },
    [connectionRoute]: {
      screen: ConnectionHome,
    },
    [expiredTokenRoute]: {
      screen: ExpiredTokenScreen,
    },
    [invitationRoute]: {
      screen: InvitationScreen,
    },
    [lockSelectionRoute]: {
      screen: LockSelectionScreen,
    },
    [lockEnterPinRoute]: {
      screen: LockEnterPinScreen,
    },
    [lockPinSetupRoute]: {
      screen: LockPinCodeSetupScreen,
    },
    [lockTouchIdSetupRoute]: {
      screen: LockTouchIdSetupScreen,
    },
    [lockSetupSuccessRoute]: {
      screen: LockSetupSuccessScreen,
    },
    [lockEnterFingerprintRoute]: {
      screen: LockEnterFingerprintScreen,
    },
    [proofRequestRoute]: {
      screen: ProofRequestScreen,
    },
    [connectionHistoryRoute]: {
      screen: ConnectionHistoryScreen,
    },
    [connectionHistoryDetailsRoute]: {
      screen: ConnectionHistoryDetailsScreen,
    },
    [switchEnvironmentRoute]: {
      screen: SwitchEnvironmentScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: splashScreenRoute,
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
)

// TODO:KS create a custom navigator to track page changes
// for flows to support deep link, etc.
const ConnectMeAppNavigator = StackNavigator(
  {
    CardStack: { screen: CardStack },
    [claimOfferRoute]: { screen: ClaimOffer },
    [lockAuthorizationRoute]: { screen: LockAuthorization },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

let navigator = ConnectMeAppNavigator

// Temporary disabled
// Reason:
// Ref to ConnectMeAppNavigator on App component was not working as expected

if (__DEV__) {
  // Tried to extend console interface, but it didn't work
  // need to fix, so ignoring error for now
  // `FlowFixMe`
  // navigator = console.tron.overlay(navigator)
}

export default navigator

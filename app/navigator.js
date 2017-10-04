// @flow
import React from 'react'
import { StyleSheet } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './invitation/splash-screen'
import { Settings } from './settings'
import ExpiredTokenScreen from './expired-token/expired-token'
import QRCodeScanner from './qr-code/qr-code'
import QRConnectionRequestScreen
  from './qr-connection-request/qr-connection-request'
import SMSConnectionRequestScreen
  from './sms-connection-request/sms-connection-request'
import LockSelectionScreen from './lock/lock-selection'
import LockEnterPinScreen from './lock/lock-enter-pin-code'
import LockPinCodeSetupScreen from './lock/lock-pin-code-setup'
import LockSetupSuccessScreen from './lock/lock-setup-success'
import ClaimOffer from './claim-offer/claim-offer'
import { Icon } from './components'
import {
  splashScreenRoute,
  homeRoute,
  invitationRoute,
  connectionRoute,
  expiredTokenRoute,
  qrConnectionRequestRoute,
  smsConnectionRequestRoute,
  lockEnterPinRoute,
  lockSelectionRoute,
  lockPinSetupRoute,
  lockSetupSuccessRoute,
  claimOfferRoute,
  homeTabRoute,
  settingsTabRoute,
  qrCodeScannerTabRoute,
} from './common/'
import { color } from './common/styles'

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
          return focused
            ? <Icon src={require('./images/dashboard_large.png')} mediumLarge />
            : <Icon src={require('./images/dashboard.png')} medium />
        },
      },
    },
    [settingsTabRoute]: {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          return focused
            ? <Icon src={require('./images/settings_large.png')} mediumLarge />
            : <Icon src={require('./images/settings.png')} medium />
        },
      },
    },
    [qrCodeScannerTabRoute]: {
      screen: QRCodeScanner,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          return focused
            ? <Icon src={require('./images/addConnection.png')} mediumLarge />
            : <Icon src={require('./images/addConnection.png')} medium />
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
    [invitationRoute]: {
      screen: InvitationScreen,
    },
    [connectionRoute]: {
      screen: ConnectionHome,
    },
    [expiredTokenRoute]: {
      screen: ExpiredTokenScreen,
    },
    [qrConnectionRequestRoute]: {
      screen: QRConnectionRequestScreen,
    },
    [smsConnectionRequestRoute]: {
      screen: SMSConnectionRequestScreen,
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
    [lockSetupSuccessRoute]: {
      screen: LockSetupSuccessScreen,
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
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

export default ConnectMeAppNavigator

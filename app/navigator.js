// @flow
import React from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import AboutApp from './about-app/about-app'
import AuthenticationScreen from './authentication/authentication'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './authentication/splash-screen'
import Settings from './settings/settings'
import ExpiredTokenScreen from './expired-token/expired-token'
import QRCodeScanner from './qr-code/qr-code'
import LockSelectionScreen from './lock/lock-selection'
import LockEnterPinScreen from './lock/lock-enter-pin-code'
import LockTouchIdSetupScreen from './lock/lock-fingerprint-setup'
import LockPinCodeSetupScreen from './lock/lock-pin-code-setup'
import LockSetupSuccessScreen from './lock/lock-setup-success'
import LockEnterFingerprintScreen from './lock/lock-enter-fingerprint'
import ClaimOffer from './claim-offer/claim-offer'
import ClaimRequestModal from './claim-offer/claim-request-modal'
import ProofRequestScreen from './proof-request/proof-request'
import InvitationScreen from './invitation/invitation'
import ConnectionHistoryNavigator from './connection-history/connection-history-navigator'
import SwitchEnvironmentScreen from './switch-environment/switch-environment'
import LockAuthorization from './lock/lock-authorization'
import WaitForInvitationScreen from './invitation/wait-for-invitation'
import Wallet from './wallet/wallet'
import GenerateRecoveryPhrase from './backup/generate-phrase'
import VerifyRecoveryPhrase from './backup/verify-phrase'
import ExportBackupFile from './backup/export-backup'
import BackupComplete from './backup/backup-complete'
import WalletTabs from './wallet/wallet-tabs'
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
  switchEnvironmentRoute,
  lockAuthorizationRoute,
  waitForInvitationRoute,
  walletRoute,
  aboutAppRoute,
  walletTabSendDetailsRoute,
  eulaRoute,
  genRecoveryPhraseRoute,
  verifyRecoveryPhraseRoute,
  exportBackupFileRoute,
  backupCompleteRoute,
  restoreRoute,
  restoreWaitRoute,
  restorePassphraseRoute,
} from './common/'
import { color } from './common/styles'
import WalletTabSendDetails from './wallet/wallet-tab-send-details'
import EulaScreen from './eula/eula'
import RestoreStartScreen from './restore/restore'
import { RestoreWaitScreen } from './restore/restore-wait'
import RestorePassphrase from './restore/restore-passphrase'

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
        tabBarTestIDProps: {
          testID: 'tab-bar-home-icon',
          accessible: true,
          accessibleLabel: 'tab-bar-home-icon',
          accessibilityLabel: 'tab-bar-home-icon',
        },
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
        tabBarTestIDProps: {
          testID: 'tab-bar-settings-icon',
          accessible: true,
          accessibleLabel: 'tab-bar-settings-icon',
          accessibilityLabel: 'tab-bar-settings-icon',
        },
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
        tabBarTestIDProps: {
          testID: 'tab-bar-qrcode-icon',
          accessible: true,
          accessibleLabel: 'tab-bar-qrcode-icon',
          accessibilityLabel: 'tab-bar-qrcode-icon',
        },
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
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
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
    [switchEnvironmentRoute]: {
      screen: SwitchEnvironmentScreen,
    },
    [waitForInvitationRoute]: {
      screen: WaitForInvitationScreen,
    },
    [eulaRoute]: {
      screen: EulaScreen,
    },
    [restoreRoute]: {
      screen: RestoreStartScreen,
    },
    [restorePassphraseRoute]: {
      screen: RestorePassphrase,
    },
    [restoreWaitRoute]: {
      screen: RestoreWaitScreen,
    },
    [genRecoveryPhraseRoute]: { screen: GenerateRecoveryPhrase },
    [verifyRecoveryPhraseRoute]: { screen: VerifyRecoveryPhrase },
    [exportBackupFileRoute]: { screen: ExportBackupFile },
    [backupCompleteRoute]: { screen: BackupComplete },
  },
  {
    headerMode: 'none',
    initialRouteName: splashScreenRoute,
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
)

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const height = layout.initHeight
      const width = layout.initWidth

      const scale = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.7, thisSceneIndex],
        outputRange: [0.5, 0.7, 1],
      })

      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.5, thisSceneIndex],
        outputRange: [0, 0.3, 1],
      })

      return {
        opacity,
        transform: [{ scale }],
      }
    },
  }
}

// TODO:KS create a custom navigator to track page changes
// for flows to support deep link, etc.
const ConnectMeAppNavigator = StackNavigator(
  {
    CardStack: { screen: CardStack },
    [claimOfferRoute]: { screen: ClaimOffer },
    [lockAuthorizationRoute]: { screen: LockAuthorization },
    [proofRequestRoute]: {
      screen: ProofRequestScreen,
    },
    [connectionHistoryRoute]: {
      screen: ConnectionHistoryNavigator,
    },
    [walletRoute]: { screen: Wallet },
    [walletTabSendDetailsRoute]: {
      screen: WalletTabSendDetails,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transitionConfig,
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

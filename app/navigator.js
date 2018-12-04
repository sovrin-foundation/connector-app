// @flow
import React from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'
import {
  createStackNavigator,
  TabBarBottom,
  createTabNavigator,
} from 'react-navigation'
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
import BackupErrorScreen from './backup/backup-error'
import WalletTabs from './wallet/wallet-tabs'
import { Icon, CustomView } from './components'
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
  backupErrorRoute,
  connectionsTabRoute,
  credentialsTabRoute,
  discoverTabRoute,
  menuTabRoute,
} from './common/'
import { color } from './common/styles'
import WalletTabSendDetails from './wallet/wallet-tab-send-details'
import EulaScreen from './eula/eula'
import RestoreStartScreen from './restore/restore'
import RestoreWaitScreen from './restore/restore-wait'
import RestorePassphrase from './restore/restore-passphrase'
import { checkIfAnimationToUse } from './bridge/react-native-cxs/RNCxs'
import SvgCustomIcon from './components/svg-custom-icon'
import {
  TAB_CONNECTIONS_TITLE,
  TAB_CREDENTIALS_TITLE,
  TAB_DISCOVER_TITLE,
  TAB_MENU_TITLE,
  TAB_SCAN_TITLE,
} from './type-navigator'
import { Button } from 'react-native-elements'

if (__DEV__) {
  require('../tools/reactotron-config')
}

const styles = StyleSheet.create({
  // tabBarContainer: {
  //   backgroundColor: color.bg.tertiary.color,
  //   borderTopWidth: 0,
  // },
  tabBarContainer: {
    backgroundColor: color.bg.tertiary.color,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
  },
  tabBarTitle: {
    fontWeight: 'bold',
  },
})

// const Tabs = createTabNavigator(
//   {
//     [homeTabRoute]: {
//       screen: HomeScreen,
//       navigationOptions: {
//         tabBarTestIDProps: {
//           testID: 'tab-bar-home-icon',
//           accessible: true,
//           accessibleLabel: 'tab-bar-home-icon',
//           accessibilityLabel: 'tab-bar-home-icon',
//         },
//         tabBarIcon: ({ focused }) => {
//           return focused ? (
//             <Icon src={require('./images/dashboard_large.png')} mediumLarge />
//           ) : (
//             <Icon src={require('./images/dashboard.png')} medium />
//           )
//         },
//       },
//     },
//     [settingsTabRoute]: {
//       screen: Settings,
//       navigationOptions: {
//         tabBarTestIDProps: {
//           testID: 'tab-bar-settings-icon',
//           accessible: true,
//           accessibleLabel: 'tab-bar-settings-icon',
//           accessibilityLabel: 'tab-bar-settings-icon',
//         },
//         tabBarIcon: ({ focused }) => {
//           return focused ? (
//             <Icon src={require('./images/settings_large.png')} mediumLarge />
//           ) : (
//             <Icon src={require('./images/settings.png')} medium />
//           )
//         },
//       },
//     },
//     [qrCodeScannerTabRoute]: {
//       screen: QRCodeScanner,
//       navigationOptions: {
//         tabBarTestIDProps: {
//           testID: 'tab-bar-qrcode-icon',
//           accessible: true,
//           accessibleLabel: 'tab-bar-qrcode-icon',
//           accessibilityLabel: 'tab-bar-qrcode-icon',
//         },
//         tabBarVisible: false,
//         tabBarIcon: () => {
//           return <Icon src={require('./images/addConnection.png')} medium />
//         },
//       },
//     },
//   },
//   {
//     animationEnabled: true,
//     swipeEnabled: true,
//     lazy: false,
//     initialRouteName: homeTabRoute,
//     order: [settingsTabRoute, homeTabRoute, qrCodeScannerTabRoute],
//     tabBarOptions: {
//       showLabel: false,
//       style: styles.tabBarContainer,
//     },
//     tabBarComponent: TabBarBottom,
//     tabBarPosition: 'bottom',
//   }
// )

const Tabs = createTabNavigator(
  {
    [connectionsTabRoute]: {
      screen: HomeScreen,
      navigationOptions: {
        title: TAB_CONNECTIONS_TITLE,
        tabBarTestIDProps: {
          testID: 'tab-bar-home-icon',
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: `Go to ${TAB_CONNECTIONS_TITLE}`,
        },
        tabBarIcon: ({ focused }) => {
          return (
            <SvgCustomIcon
              name="Connections"
              fill={focused ? color.actions.font.seventh : color.actions.sixth}
            />
          )
        },
      },
    },
    //   [credentialsTabRoute]: {
    //     screen: Settings,
    //     navigationOptions: {
    //       title: TAB_CREDENTIALS_TITLE,
    //       tabBarTestIDProps: {
    //         testID: 'tab-bar-settings-icon',
    //         accessible: true,
    //         accessibilityRole: "button",
    //         accessibilityLabel: `Go to ${TAB_CREDENTIALS_TITLE}`,
    //       },
    //       tabBarIcon: ({ focused }) => {
    //         if (focused) {
    //           return <SvgCustomIcon name="CredentialsOn" />
    //         }
    //         return <SvgCustomIcon name="Credentials" />
    //       },
    //     },
    //   },
    //   [discoverTabRoute]: {
    //     screen: Settings,
    //     navigationOptions: {
    //       title: TAB_DISCOVER_TITLE,
    //       tabBarTestIDProps: {
    //         testID: 'tab-bar-qrcode-icon',
    //         accessible: true,
    //         accessibilityRole: "button",
    //         accessibilityLabel: `Go to ${TAB_DISCOVER_TITLE}`,
    //       },
    //       tabBarIcon: ({ focused }) => {
    //         return (
    //           <SvgCustomIcon
    //             name="Discover"
    //             fill={focused ? color.actions.font.seventh : color.actions.sixth}
    //           />
    //         )
    //       },
    //     },
    //  },
    [qrCodeScannerTabRoute]: {
      screen: QRCodeScanner,
      navigationOptions: {
        title: TAB_SCAN_TITLE,
        tabBarTestIDProps: {
          testID: 'tab-bar-qrcode-icon',
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: `Go to ${TAB_SCAN_TITLE}`,
        },
        tabBarVisible: false,
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <SvgCustomIcon
                name="ScanOn"
                fill={
                  focused ? color.actions.font.seventh : color.actions.sixth
                }
              />
            )
          }
          return (
            <SvgCustomIcon
              name="Scan"
              fill={focused ? color.actions.font.seventh : color.actions.sixth}
            />
          )
        },
      },
    },
    [menuTabRoute]: {
      screen: Settings,
      navigationOptions: {
        title: TAB_MENU_TITLE,
        tabBarTestIDProps: {
          testID: 'tab-bar-qrcode-icon',
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: `Go to ${TAB_MENU_TITLE}`,
        },
        tabBarIcon: ({ focused }) => {
          return (
            <CustomView style={[{ paddingTop: 10 }]}>
              <SvgCustomIcon
                name="Menu"
                fill={
                  focused ? color.actions.font.seventh : color.actions.sixth
                }
              />
            </CustomView>
          )
        },
      },
    },
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    lazy: true,
    initialRouteName: connectionsTabRoute,
    order: [
      connectionsTabRoute,
      // credentialsTabRoute,
      // discoverTabRoute,
      qrCodeScannerTabRoute,
      menuTabRoute,
    ],
    tabBarOptions: {
      style: [styles.tabBarContainer],
      labelStyle: [styles.tabBarTitle],
      activeTintColor: color.actions.font.seventh,
      inactiveTintColor: color.actions.sixth,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
  }
)
const CardStack = createStackNavigator(
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
    [backupErrorRoute]: { screen: BackupErrorScreen },
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
      duration: checkIfAnimationToUse() ? 30 : 300,
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
const ConnectMeAppNavigator = createStackNavigator(
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

// @flow
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import {
  AppRegistry,
  StatusBar,
  BackHandler,
  ToastAndroid,
  Platform,
} from 'react-native'
import store, { ROUTE_UPDATE } from './store'
import { getStatusBarTheme } from './store/store-selector'
import { Container } from './components'
import { PushNotification } from './push-notification'
import DeepLink from './deep-link'
import {
  barStyleLight,
  barStyleDark,
  whiteSmokeSecondary,
  color,
  venetianRed,
  white,
} from './common/styles/constant'
import ConnectMeAppNavigator from './navigator'
import {
  qrCodeScannerTabRoute,
  homeRoute,
  walletRoute,
  genRecoveryPhraseRoute,
  verifyRecoveryPhraseRoute,
  exportBackupFileRoute,
  backupCompleteRoute,
  connectionHistoryRoute,
  claimOfferRoute,
  walletTabSendDetailsRoute,
  lockTouchIdSetupRoute,
  lockPinSetupHomeRoute,
  settingsTabRoute,
  settingsRoute,
  authenticationRoute,
  lockSetupSuccessRoute,
  invitationRoute,
  proofRequestRoute,
  lockEnterPinRoute,
  homeTabRoute,
  splashScreenRoute,
  privacyTNCRoute,
  aboutAppRoute,
  eulaRoute,
  lockSelectionRoute,
  lockAuthorizationRoute,
  lockAuthorizationHomeRoute,
  lockPinSetupRoute,
  restoreRoute,
  backupErrorRoute,
  restorePassphraseRoute,
  restoreWaitRoute,
  expiredTokenRoute,
  connectionHistoryDetailsRoute,
} from './common'
import { NavigationActions } from 'react-navigation'
import { setupFeedback } from './feedback'
import { updateStatusBarTheme } from './store/connections-store'
import type { AppState } from './type-app'
import { exitAppAndroid } from './bridge/react-native-cxs/RNCxs'

const backButtonDisableRoutes = [
  lockEnterPinRoute,
  homeTabRoute,
  homeRoute,
  splashScreenRoute,
  settingsRoute,
  qrCodeScannerTabRoute,
  invitationRoute,
  lockSetupSuccessRoute,
  eulaRoute,
  lockSelectionRoute,
  lockPinSetupHomeRoute,
  lockAuthorizationHomeRoute,
  genRecoveryPhraseRoute,
  backupCompleteRoute,
  restoreRoute,
  restoreWaitRoute,
]

const backButtonExitRoutes = [
  homeRoute,
  settingsRoute,
  qrCodeScannerTabRoute,
  eulaRoute,
  lockSelectionRoute,
]

const backButtonConditionalRoutes = [
  lockPinSetupHomeRoute,
  lockAuthorizationHomeRoute,
]

class ConnectMeApp extends PureComponent<void, AppState> {
  state = {
    statusBarTheme: whiteSmokeSecondary,
  }

  currentRouteKey: string = ''
  currentRoute: string = ''
  navigatorRef = null
  currentRouteParams = null
  exitTimeout: number = 0

  componentDidMount() {
    this.setState({
      statusBarTheme: getStatusBarTheme(store.getState()),
    })
    store.dispatch(updateStatusBarTheme())
    store.subscribe(() => {
      this.handleChange()
    })

    if (Platform.OS === 'android') {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick
      )
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick
      )
    }
  }

  handleBackButtonClick = () => {
    if (this.currentRouteKey !== '' && this.currentRoute !== '') {
      if (backButtonDisableRoutes.indexOf(this.currentRoute) < 0) {
        return false
      }

      if (backButtonConditionalRoutes.indexOf(this.currentRoute) >= 0) {
        let navigateAction = null
        switch (this.currentRoute) {
          case lockPinSetupHomeRoute:
            this.currentRouteParams &&
            this.currentRouteParams.existingPin === true
              ? (navigateAction = NavigationActions.navigate({
                  routeName: settingsTabRoute,
                }))
              : (navigateAction = NavigationActions.navigate({
                  routeName: lockSelectionRoute,
                }))
            this.navigatorRef && this.navigatorRef.dispatch(navigateAction)
            return true
          case lockAuthorizationHomeRoute:
            this.currentRouteParams &&
              this.currentRouteParams.onAvoid &&
              this.currentRouteParams.onAvoid()
            return false
        }
      }

      if (backButtonExitRoutes.indexOf(this.currentRoute) >= 0) {
        this.onBackPressExit()
      }
    }
    return true
  }

  onBackPressExit() {
    if (this.exitTimeout && this.exitTimeout + 2000 >= Date.now()) {
      exitAppAndroid()
    }
    this.exitTimeout = Date.now()
    ToastAndroid.show('Press again to exit!', ToastAndroid.SHORT)
  }

  handleChange = () => {
    if (this.state.statusBarTheme !== getStatusBarTheme(store.getState())) {
      this.setState({ statusBarTheme: getStatusBarTheme(store.getState()) })
    }
  }

  // gets the current screen from navigation state
  getCurrentRoute = navigationState => {
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRoute(route)
    }

    return route
  }

  navigationChangeHandler = (previousState, currentState) => {
    if (currentState) {
      const { routeName, key, params } = this.getCurrentRoute(currentState)
      const currentScreen = routeName

      this.currentRoute = routeName
      this.currentRouteKey = key
      this.currentRouteParams = params

      store.dispatch({
        type: ROUTE_UPDATE,
        currentScreen,
      })

      StatusBar.setBarStyle(barStyleDark, true)
      if (currentScreen === qrCodeScannerTabRoute) {
        store.dispatch(updateStatusBarTheme(color.bg.primary.color))
        StatusBar.setBarStyle(barStyleLight, true)
      } else if (
        currentScreen === homeRoute ||
        currentScreen === walletTabSendDetailsRoute
      ) {
        store.dispatch(updateStatusBarTheme(whiteSmokeSecondary))
      } else if (currentScreen === walletRoute) {
        store.dispatch(updateStatusBarTheme(color.actions.font.seventh))
      } else if (currentScreen === genRecoveryPhraseRoute) {
        store.dispatch(updateStatusBarTheme(color.bg.eleventh.color))
      } else if (
        currentScreen === verifyRecoveryPhraseRoute ||
        currentScreen === 'RestorePassphrase'
      ) {
        store.dispatch(updateStatusBarTheme(color.bg.twelfth.color))
      } else if (currentScreen === exportBackupFileRoute) {
        store.dispatch(updateStatusBarTheme(color.bg.thirteenth.color))
      } else if (currentScreen === backupCompleteRoute) {
        store.dispatch(updateStatusBarTheme(color.bg.fourteenth.color))
      } else if (currentScreen === backupErrorRoute) {
        store.dispatch(updateStatusBarTheme(venetianRed))
      } else if (currentScreen === expiredTokenRoute) {
        store.dispatch(updateStatusBarTheme(white))
      } else if (
        currentScreen !== connectionHistoryRoute &&
        currentScreen !== claimOfferRoute &&
        currentScreen !== restoreRoute &&
        currentScreen !== connectionHistoryDetailsRoute
      ) {
        // Any screen that handles its own statusbar theme should be included above.
        store.dispatch(updateStatusBarTheme())
      }
    }
  }

  navigateToRoute = (routeName, params = {}) => {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params,
    })
    this.navigatorRef && this.navigatorRef.dispatch(navigateAction)
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
          <StatusBar backgroundColor={this.state.statusBarTheme} />
          <PushNotification navigateToRoute={this.navigateToRoute} />
          <DeepLink />
          <ConnectMeAppNavigator
            ref={navigatorRef => (this.navigatorRef = navigatorRef)}
            onNavigationStateChange={this.navigationChangeHandler}
          />
        </Container>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ConnectMe', () => ConnectMeApp)

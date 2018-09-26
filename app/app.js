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
import store from './store'
import { ROUTE_UPDATE } from './store/route-store'
import { getStatusBarTheme } from './store/store-selector'
import { Container } from './components'
import { PushNotification } from './push-notification'
import DeepLink from './deep-link'
import { barStyleDark, whiteSmokeSecondary } from './common/styles/constant'
import ConnectMeAppNavigator from './navigator'
import {
  qrCodeScannerTabRoute,
  homeRoute,
  genRecoveryPhraseRoute,
  backupCompleteRoute,
  lockPinSetupHomeRoute,
  settingsTabRoute,
  settingsRoute,
  lockSetupSuccessRoute,
  invitationRoute,
  lockEnterPinRoute,
  homeTabRoute,
  splashScreenRoute,
  eulaRoute,
  lockSelectionRoute,
  lockAuthorizationHomeRoute,
  restoreRoute,
  restoreWaitRoute,
  expiredTokenRoute,
} from './common'
import { NavigationActions } from 'react-navigation'
import type { AppState } from './type-app'
import { exitAppAndroid } from './bridge/react-native-cxs/RNCxs'
import AppStatus from './app-status/app-status'
import { setupFeedback } from './feedback'

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
  expiredTokenRoute,
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
  currentRouteKey: string = ''
  currentRoute: string = ''
  navigatorRef = null
  currentRouteParams = null
  exitTimeout: number = 0

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick
      )
    }
    // components that are mounted inside of the app can also
    // change status bar style and it is getting overridden
    // so we are setting status bar style again after component is mounted
    StatusBar.setBarStyle(barStyleDark, true)
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(whiteSmokeSecondary)
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
          <StatusBar
            backgroundColor={whiteSmokeSecondary}
            barStyle={barStyleDark}
          />
          <PushNotification navigateToRoute={this.navigateToRoute} />
          <DeepLink />
          <AppStatus />
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

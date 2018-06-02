// @flow
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, StatusBar, BackHandler } from 'react-native'
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
} from './common/styles/constant'
import ConnectMeAppNavigator from './navigator'
import {
  qrCodeScannerTabRoute,
  homeRoute,
  walletRoute,
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
} from './common'
import { NavigationActions } from 'react-navigation'
import { setupFeedback } from './feedback'
import { updateStatusBarTheme } from './store/connections-store'
import type { AppState } from './type-app'

const backButtonDisableRoutes = [
  lockEnterPinRoute,
  homeTabRoute,
  homeRoute,
  splashScreenRoute,
  settingsRoute,
  qrCodeScannerTabRoute,
  lockSetupSuccessRoute,
  invitationRoute,
]

const backButtonExitRoutes = [homeRoute, settingsRoute, qrCodeScannerTabRoute]

class ConnectMeApp extends PureComponent<void, AppState> {
  state = {
    statusBarTheme: whiteSmokeSecondary,
  }

  currentRouteKey: string = ''
  currentRoute: string = ''
  navigatorRef = null

  componentDidMount() {
    this.setState({
      statusBarTheme: getStatusBarTheme(store.getState()),
    })
    store.dispatch(updateStatusBarTheme())
    store.subscribe(() => {
      this.handleChange()
    })
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  handleBackButtonClick = () => {
    if (this.currentRouteKey !== '' && this.currentRoute !== '') {
      if (backButtonDisableRoutes.indexOf(this.currentRoute) < 0) {
        const navigateAction = NavigationActions.back({
          key: this.currentRouteKey,
        })
        this.navigatorRef && this.navigatorRef.dispatch(navigateAction)
        return false
      }
      if (backButtonExitRoutes.indexOf(this.currentRoute) >= 0) {
        BackHandler.exitApp()
      }
    }
    return true
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
      const { routeName, key } = this.getCurrentRoute(currentState)
      const currentScreen = routeName

      this.currentRoute = routeName
      this.currentRouteKey = key

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
      } else if (
        currentScreen !== connectionHistoryRoute &&
        currentScreen !== claimOfferRoute
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

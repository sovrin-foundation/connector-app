import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, StatusBar } from 'react-native'
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
} from './common'
import { NavigationActions } from 'react-navigation'
import { setupFeedback } from './feedback'
import { updateStatusBarTheme } from './store/connections-store'

// for now let's start adding flow type on file by file basis
// once we have a lot of coverage for types
// we will scan all files without any flow directive for each file

class ConnectMeApp extends PureComponent {
  constructor() {
    super()
    this.state = {
      statusBarTheme: whiteSmokeSecondary,
    }
  }

  componentDidMount() {
    this.setState({
      statusBarTheme: getStatusBarTheme(store.getState()),
    })
    store.dispatch(updateStatusBarTheme())
    store.subscribe(() => {
      this.handleChange()
    })
  }

  handleChange = () => {
    if (this.state.statusBarTheme !== getStatusBarTheme(store.getState())) {
      this.setState({ statusBarTheme: getStatusBarTheme(store.getState()) })
    }
  }

  // gets the current screen from navigation state
  getCurrentRouteName = navigationState => {
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route)
    }

    return route.routeName
  }

  navigationChangeHandler = (previousState, currentState) => {
    if (currentState) {
      const currentScreen = this.getCurrentRouteName(currentState)
      store.dispatch({
        type: ROUTE_UPDATE,
        currentScreen,
      })
      StatusBar.setBarStyle(barStyleDark, true)
      if (currentScreen === qrCodeScannerTabRoute) {
        store.dispatch(updateStatusBarTheme(color.bg.primary.color))
        StatusBar.setBarStyle(barStyleLight, true)
      } else if (currentScreen === homeRoute) {
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
    this.navigatorRef.dispatch(navigateAction)
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

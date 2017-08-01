import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import ErrorTracker from './services/error-tracker'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './invitation/splash-screen'
import { Settings } from './settings'
import ExpiredTokenScreen from './expired-token/expired-token'
import store, { ROUTE_UPDATE } from './store'
import { StatusBar, Container, PushNotification } from './components'
import {
  splashScreenRoute,
  homeRoute,
  invitationRoute,
  connectionRoute,
  settingsRoute,
  expiredTokenRoute,
} from './common/route-constants'
import DeepLink from './deep-link'
import { barStyleLight } from './common/styles/constant'

// TODO:KS create a custom navigator to track page changes
// for flows to support deep link, etc.
const ConnectMeAppNavigator = StackNavigator(
  {
    [splashScreenRoute]: {
      screen: SplashScreenView,
    },
    [homeRoute]: {
      screen: HomeScreen,
    },
    [invitationRoute]: {
      screen: InvitationScreen,
    },
    [connectionRoute]: {
      screen: ConnectionHome,
    },
    [settingsRoute]: {
      screen: Settings,
    },
    [expiredTokenRoute]: {
      screen: ExpiredTokenScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: splashScreenRoute,
    navigationOptions: {
      gesturesEnabled: false, // disable back gesture for ios
    },
  }
)

class ConnectMeApp extends Component {
  // gets the current screen from navigation state
  getCurrentRouteName = navigationState => {
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route)
    }
    return route.routeName
  }

  navigationChangeHandler = (prevState, currentState) => {
    if (currentState) {
      const currentScreen = this.getCurrentRouteName(currentState)
      store.dispatch({
        type: ROUTE_UPDATE,
        currentScreen,
      })
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
          <StatusBar barStyle={barStyleLight} />
          <PushNotification />
          <DeepLink />
          <ConnectMeAppNavigator
            onNavigationStateChange={this.navigationChangeHandler}
          />
        </Container>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ConnectMe', () => ConnectMeApp)

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './invitation/splash-screen'
import store from './store'
import { StatusBar, Container, PushNotification } from './components'
import {
  splashScreenRoute,
  homeRoute,
  invitationRoute,
  connectionDetailRoute,
} from './common/route-constants'
import DeepLink from './deep-link'

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
    [connectionDetailRoute]: {
      screen: ConnectionHome,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: splashScreenRoute,
  }
)

class ConnectMeApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Container>
          <StatusBar />
          <PushNotification store={store} />
          <DeepLink />
          <ConnectMeAppNavigator />
        </Container>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ConnectMe', () => ConnectMeApp)

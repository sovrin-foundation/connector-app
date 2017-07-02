import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './invitation/splash-screen'
import store from './store'
import { Container, StatusBar } from './components'
import {
  splashScreenRoute,
  homeRoute,
  invitationRoute,
  connectionDetailRoute,
} from './common/route-constants'

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
  }
)

class ConnectMeApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Container>
          <StatusBar />
          <ConnectMeAppNavigator />
        </Container>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ConnectMe', () => ConnectMeApp)

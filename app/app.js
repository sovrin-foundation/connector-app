import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import store from './store'
import { StatusBar, Container } from './components'
import {
  homeRoute,
  invitationRoute,
  connectionDetailRoute,
} from './common/route-constants'

const ConnectMeAppNavigator = StackNavigator(
  {
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

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'

import store from './store'

const ConnectMeAppNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Connections: {
      screen: InvitationScreen,
    },
    ConnectionDetail: {
      screen: ConnectionHome,
    },
  },
  {
    headerMode: 'none',
  }
)

class ConnectMeApp extends Component {
  render() {
    return <Provider store={store}><ConnectMeAppNavigator /></Provider>
  }
}

AppRegistry.registerComponent('ConnectMe', () => ConnectMeApp)

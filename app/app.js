import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, Text, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import CallCenterHome from './callcenter/callcenter'

import store from './store'

const ConnectMeAppNavigator = StackNavigator(
  {
    Home: {
      screen: InvitationScreen,
    },
    Connections: {
      screen: InvitationScreen,
    },
    CallCenter: {
      screen: CallCenterHome,
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

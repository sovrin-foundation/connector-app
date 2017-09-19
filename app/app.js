import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import ErrorTracker from './services'
import InvitationScreen from './invitation/invitation'
import HomeScreen from './home/home'
import ConnectionHome from './connection/connection'
import SplashScreenView from './invitation/splash-screen'
import { Settings } from './settings'
import ExpiredTokenScreen from './expired-token/expired-token'
import QRCodeScanner from './qr-code/qr-code'
import QRConnectionRequestScreen
  from './qr-connection-request/qr-connection-request'
import SMSConnectionRequestScreen
  from './sms-connection-request/sms-connection-request'
import store, { ROUTE_UPDATE } from './store'
import { StatusBar, Container, PushNotification } from './components'
import {
  splashScreenRoute,
  homeRoute,
  invitationRoute,
  connectionRoute,
  settingsRoute,
  expiredTokenRoute,
  qrCodeScannerRoute,
  qrConnectionRequestRoute,
  smsConnectionRequestRoute,
  lockEnterPinRoute,
  lockSelectionRoute,
  lockPinSetupRoute,
  lockSetupSuccessRoute,
} from './common/'
import DeepLink from './deep-link'
import { barStyleLight } from './common/styles/constant'
import LockSelectionScreen from './lock/lock-selection'
import LockEnterPinScreen from './lock/lock-enter-pin-code'
import LockPinCodeSetupScreen from './lock/lock-pin-code-setup'
import LockSetupSuccessScreen from './lock/lock-setup-success'
import RNIndy, {
  createWalletWithPoolName,
} from './bridge/react-native-indy/RNIndyNativeModule'

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
    [qrCodeScannerRoute]: {
      screen: QRCodeScanner,
    },
    [qrConnectionRequestRoute]: {
      screen: QRConnectionRequestScreen,
    },
    [smsConnectionRequestRoute]: {
      screen: SMSConnectionRequestScreen,
    },
    [lockSelectionRoute]: {
      screen: LockSelectionScreen,
    },
    [lockEnterPinRoute]: {
      screen: LockEnterPinScreen,
    },
    [lockPinSetupRoute]: {
      screen: LockPinCodeSetupScreen,
    },
    [lockSetupSuccessRoute]: {
      screen: LockSetupSuccessScreen,
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
;(async function() {
  const wallet = await createWalletWithPoolName()
})()
console.log('called async create pool')

// for now let's start adding flow type on file by file basis
// once we have a lot of coverage for types
// we will scan all files without any flow directive for each file

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

import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, StatusBar } from 'react-native'
import store, { ROUTE_UPDATE } from './store'
import { Container, PushNotification } from './components'
import DeepLink from './deep-link'
import { barStyleLight, barStyleDark } from './common/styles/constant'
import ConnectMeAppNavigator from './navigator'
import { qrCodeScannerTabRoute } from './common'

// for now let's start adding flow type on file by file basis
// once we have a lot of coverage for types
// we will scan all files without any flow directive for each file

class ConnectMeApp extends PureComponent {
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
      if (currentScreen === qrCodeScannerTabRoute) {
        StatusBar.setBarStyle(barStyleLight, true)
      } else {
        StatusBar.setBarStyle(barStyleDark, true)
      }
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
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

import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { AppRegistry, StatusBar } from 'react-native'
import store, { ROUTE_UPDATE } from './store'
import { Container } from './components'
import { PushNotification } from './push-notification'
import DeepLink from './deep-link'
import { barStyleLight, barStyleDark } from './common/styles/constant'
import ConnectMeAppNavigator from './navigator'
import { qrCodeScannerTabRoute } from './common'
import { NavigationActions } from 'react-navigation'
import ApptentiveMessage from './feedback'

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

  navigationChangeHandler = (previousState, currentState) => {
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

  navigateToRoute = (routeName, params = {}) => {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params,
    })
    this.navigatorRef.dispatch(navigateAction)
  }
  componentDidMount() {
    ApptentiveMessage()
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
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

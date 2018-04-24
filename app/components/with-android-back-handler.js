//@flow
//TODO add tests
import React, { Component } from 'react'
import { BackHandler, Platform } from 'react-native'

//Limitations -
// cannot handle static properties and refs
export const withAndroidBackHandler = (WrappedComponent: any) => {
  class WithAndroidBackHandler extends Component<void, void> {
    static navigationOptions = WrappedComponent.navigationOptions

    componentDidMount() {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', () => true)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  WithAndroidBackHandler.displayName = `WithAndroidBackHandler(${getDisplayName(
    WrappedComponent
  )})`
  return WithAndroidBackHandler
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

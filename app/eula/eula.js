// @flow

// this is page displays, a webview with of our terms and conditions
// you should get the url value and title from constants
// on click accept take user to lock selection screen.
// add to redux state that eulaAccept : true -> this should happen in splash screen.
// TODO: add eulaAccept to async storage.

import React, { PureComponent } from 'react'
import { WebView, Alert } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import { CustomText, Container, FooterActions } from '../components'
import { eulaRoute, restoreRoute } from '../common'
import { eulaAccept } from './eula-store'
import type { Store } from '../store/type-store'
import { EULA_URL } from './type-eula'

export class EulaScreen extends PureComponent<*, void> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Terms and Conditions',
    headerStyle: tertiaryHeaderStyles.header,
    swipeEnabled: false,
    headerTitleStyle: tertiaryHeaderStyles.title,
  })

  onReject = () => {
    Alert.alert(
      'Alert',
      'You will not be able to use the application without accepting Terms and Conditions'
    )
  }

  onAccept = () => {
    this.props.eulaAccept(true)
    this.props.navigation.navigate(restoreRoute)
  }

  render() {
    return (
      <Container fifth>
        <WebView
          source={{
            uri: EULA_URL,
          }}
        />
        <FooterActions
          onAccept={this.onAccept}
          onDecline={this.onReject}
          denyTitle="Decline"
          acceptTitle="Accept"
          testID="eula"
        />
      </Container>
    )
  }
}

const mapStateToProps = ({ eula }: Store) => ({
  eula,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      eulaAccept,
    },
    dispatch
  )

export default StackNavigator({
  [eulaRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(EulaScreen),
  },
})

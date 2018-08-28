// @flow

// this is page displays, a webview with of our terms and conditions
// you should get the url value and title from constants
// on click accept take user to lock selection screen

import React, { PureComponent } from 'react'
import { WebView, Alert } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import {
  CustomText,
  Container,
  FooterActions,
  CustomHeader,
} from '../components'
import { eulaRoute, restoreRoute } from '../common'
import { eulaAccept } from './eula-store'
import type { Store } from '../store/type-store'
import { EULA_URL } from './type-eula'
import { color } from '../common/styles/constant'

export class EulaScreen extends PureComponent<*, void> {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomHeader
        backgroundColor={color.bg.tertiary.color}
        flatHeader
        centerComponent={
          <CustomText bg="tertiary" tertiary transparentBg semiBold>
            Terms and Conditions
          </CustomText>
        }
      />
    ),
    swipeEnabled: false,
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

export default createStackNavigator({
  [eulaRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(EulaScreen),
  },
})

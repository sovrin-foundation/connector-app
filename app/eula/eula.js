// @flow

// this is page displays, a webview with of our terms and conditions
// you should get the url value and title from constants
// on click accept take user to lock selection screen.
// add to redux state that eulaAccept : true -> this should happen in splash screen.
// TODO: add eulaAccept to async storage.

import React, { PureComponent } from 'react'
import { WebView } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import { CustomText, Container } from '../components'
import { lockSelectionRoute, eulaRoute } from '../common'
import { eulaAccept } from './eula-store'
import { FooterActions } from '../components/footer-actions/footer-actions'
import type { Store } from '../store/type-store'

export class EulaScreen extends PureComponent<*, void> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Terms and Conditions',
    headerStyle: tertiaryHeaderStyles.header,
    swipeEnabled: false,
    headerTitleStyle: tertiaryHeaderStyles.title,
  })

  onReject = () => {
    // TODO : No logic given. by Product owner
    return null
  }

  onAccept = () => {
    this.props.eulaAccept(true)
    this.props.navigation.navigate(lockSelectionRoute)
  }

  render() {
    return (
      <Container fifth>
        <WebView
          source={{
            uri:
              'https://www.apple.com/in/legal/internet-services/terms/site.html',
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

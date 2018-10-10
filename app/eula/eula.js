// @flow

// this is page displays, a webview with of our terms and conditions
// you should get the url value and title from constants
// on click accept take user to lock selection screen

import React, { PureComponent } from 'react'
import { WebView, Alert, View } from 'react-native'
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
import { EULA_URL, localEulaSource } from './type-eula'
import { color } from '../common/styles/constant'
import { LoaderGif } from '../components/loader-gif/loader-gif'
import type { EulaScreenState } from './type-eula'
import type { CustomError } from '../common/type-common'

export class EulaScreen extends PureComponent<*, EulaScreenState> {
  state = {
    error: null,
  }

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

  onError = (error: CustomError) => {
    if (error) {
      this.setState({ error })
    }
  }

  onAccept = () => {
    this.props.eulaAccept(true)
    this.props.navigation.navigate(restoreRoute)
  }

  render() {
    const webViewUri = this.state.error ? localEulaSource : EULA_URL

    return (
      <Container fifth>
        <WebView
          source={{ uri: webViewUri }}
          startInLoadingState={true}
          renderLoading={() => LoaderGif}
          onError={this.onError}
          renderError={() => <View />}
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

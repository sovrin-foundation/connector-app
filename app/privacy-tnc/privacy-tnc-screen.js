// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image, WebView, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStackNavigator } from 'react-navigation'
import {
  Container,
  CustomText,
  CustomView,
  Icon,
  CustomHeader,
} from '../components'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_4X,
  OFFSET_6X,
  OFFSET_7X,
} from '../common/styles'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import type { PrivacyTNCProps, PrivacyTNCState } from './type-privacy-tnc'
import {
  TermsAndConditionsTitle,
  TermsAndConditionUrl,
  PrivacyPolicyTitle,
  PrivacyPolicyUrl,
  localPrivacyPolicySource,
} from '../common/privacyTNC-constants'
import { LoaderGif } from '../components/loader-gif/loader-gif'
import type { CustomError } from '../common/type-common'
import { localEulaSource } from '../eula/type-eula'

const styles = StyleSheet.create({
  headerLeft: {
    width: OFFSET_2X,
  },
})

export class PrivacyTNC extends PureComponent<
  PrivacyTNCProps,
  PrivacyTNCState
> {
  static INFO_TYPE = {
    PRIVACY: { url: PrivacyPolicyUrl, title: PrivacyPolicyTitle },
    TNC: { url: TermsAndConditionUrl, title: TermsAndConditionsTitle },
  }

  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomHeader flatHeader backgroundColor={color.bg.tertiary.color}>
        <Icon
          small
          testID={'back-arrow'}
          iconStyle={[styles.headerLeft]}
          src={require('../images/icon_backArrow.png')}
          resizeMode="contain"
          onPress={() => navigation.goBack()}
        />

        <CustomText bg="tertiary" tertiary transparentBg semiBold>
          {navigation.state.params.title}
        </CustomText>

        <CustomView />
      </CustomHeader>
    ),
    swipeEnabled: false,
  })

  state = {
    error: null,
  }

  onError = (error: CustomError) => {
    this.setState({ error })
  }

  render() {
    let webViewUri = this.props.navigation.state.params.url
    const isTNC = webViewUri === PrivacyTNC.INFO_TYPE.TNC.url

    if (this.state.error) {
      webViewUri = isTNC ? localEulaSource : localPrivacyPolicySource
    }

    return (
      <WebView
        source={{ uri: webViewUri }}
        startInLoadingState={true}
        renderLoading={() => LoaderGif}
        onError={this.onError}
        renderError={() => <View />}
      />
    )
  }
}

export default PrivacyTNC

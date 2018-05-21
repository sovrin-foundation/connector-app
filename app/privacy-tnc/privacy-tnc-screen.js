// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image, WebView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StackNavigator } from 'react-navigation'
import {
  Container,
  CustomText,
  CustomView,
  Icon,
  withAndroidBackHandler,
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
import type { PrivacyTNCProps } from './type-privacy-tnc'
import {
  TermsAndConditionsTitle,
  TermsAndConditionUrl,
  PrivacyPolicyTitle,
  PrivacyPolicyUrl,
} from '../common/privacyTNC-constants'

const styles = StyleSheet.create({
  headerLeft: {
    width: OFFSET_2X,
  },
  title: {
    marginTop: OFFSET_6X,
    marginBottom: OFFSET_7X,
  },
  titleText: {
    lineHeight: 28,
    letterSpacing: 0.5,
    paddingHorizontal: OFFSET_1X,
  },
  MiddleBox: {
    marginHorizontal: OFFSET_7X,
    paddingVertical: OFFSET_2X,
  },
})

export class PrivacyTNC extends PureComponent<PrivacyTNCProps> {
  static INFO_TYPE = {
    PRIVACY: { url: PrivacyPolicyUrl, title: PrivacyPolicyTitle },
    TNC: { url: TermsAndConditionUrl, title: TermsAndConditionsTitle },
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Icon
        testID={'back-arrow'}
        iconStyle={[styles.headerLeft]}
        src={require('../images/icon_backArrow.png')}
        resizeMode="contain"
        onPress={() => navigation.goBack()}
      />
    ),
    headerTitle: (
      <CustomText bg="tertiary" tertiary transparentBg semiBold>
        {navigation.state.params.title}
      </CustomText>
    ),
    headerStyle: tertiaryHeaderStyles.header,
    tabBarVisible: false,
    swipeEnabled: false,
  })

  render() {
    return (
      <WebView
        source={{
          uri: this.props.navigation.state.params.url,
        }}
      />
    )
  }
}

export default PrivacyTNC

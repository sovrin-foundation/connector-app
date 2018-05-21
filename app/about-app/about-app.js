// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image, View } from 'react-native'
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
  OFFSET_6X,
  OFFSET_7X,
  dimGray,
  lightGray,
} from '../common/styles'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import { aboutAppRoute, privacyTNCRoute } from '../common'
import type { AboutAppProps, AboutAppListItemProps } from './type-about-app'
import VersionNumber from 'react-native-version-number'
import { ListItem } from 'react-native-elements'

import PrivacyTNC from '../privacy-tnc/privacy-tnc-screen'

const styles = StyleSheet.create({
  headerLeft: {
    width: OFFSET_2X,
  },
  thickLine: {
    height: 2,
    width: 140,
    borderBottomColor: lightGray,
    borderBottomWidth: 2,
  },
  topFloatText: {
    paddingBottom: OFFSET_1X,
  },
  bottomFloatText: {
    paddingBottom: OFFSET_1X / 2,
  },
})

export class AboutAppListItem extends PureComponent<
  AboutAppListItemProps,
  void
> {
  render() {
    return (
      <ListItem
        title={
          <CustomView>
            <CustomText h5 semiBold bg="fifth">
              {this.props.titleValue}
            </CustomText>
          </CustomView>
        }
        onPress={this.props.onPress}
        rightIcon={{
          name: 'chevron-right',
          color: dimGray,
        }}
      />
    )
  }
}

const logoConnectMe = require('../images/logo_connectme.png')
const logoEvernym = require('../images/logo_evernym.png')
const logoSovrin = require('../images/logo_sovrin.png')
const versionNumber = VersionNumber
export class AboutApp extends PureComponent<AboutAppProps> {
  // TODO: Move the below values to constants
  openTermsAndConditions = () => {
    this.props.navigation.navigate(privacyTNCRoute, PrivacyTNC.INFO_TYPE.TNC)
  }

  openPrivacyPolicy = () => {
    this.props.navigation.navigate(
      privacyTNCRoute,
      PrivacyTNC.INFO_TYPE.PRIVACY
    )
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
        About This App
      </CustomText>
    ),
    headerStyle: tertiaryHeaderStyles.header,
    tabBarVisible: false,
    swipeEnabled: false,
  })

  render() {
    return (
      <Container tertiary>
        <CustomView center doubleVerticalSpace>
          <Image source={logoConnectMe} />
          <CustomView center doubleVerticalSpace>
            <CustomText bg="tertiary" tertiary transparentBg semiBold>
              VERSION # {versionNumber.appVersion}
            </CustomText>
          </CustomView>
          <CustomView center verticalSpace>
            <CustomText bg="tertiary" tertiary transparentBg semiBold>
              BUILD # {versionNumber.buildVersion}
            </CustomText>
          </CustomView>
          <CustomView verticalSpace vCenter style={[styles.thickLine]} />
          <CustomView doubleVerticalSpace>
            <CustomText
              bg="tertiary"
              tertiary
              transparentBg
              h7
              style={[styles.topFloatText]}
            >
              built by
            </CustomText>
            <Image source={logoEvernym} />
          </CustomView>
          <CustomView verticalSpace>
            <CustomText
              bg="tertiary"
              tertiary
              transparentBg
              h7
              style={[styles.bottomFloatText]}
            >
              powered by
            </CustomText>
            <Image source={logoSovrin} />
          </CustomView>
        </CustomView>
        <Container>
          {/* TODO: move the below titles also to constants */}
          <AboutAppListItem
            titleValue={'Terms and Conditions'}
            onPress={this.openTermsAndConditions}
          />
          <AboutAppListItem
            titleValue={'Privacy Policy'}
            onPress={this.openPrivacyPolicy}
          />
        </Container>
      </Container>
    )
  }
}

export default AboutApp

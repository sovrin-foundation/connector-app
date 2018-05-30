// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, Dimensions } from 'react-native'
import {
  CustomView,
  CustomText,
  Icon,
  ImageColorPicker,
  CustomSafeAreaView,
} from '../../components'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  isiPhone5,
  font,
  white,
} from '../../common/styles'
import empty from '../../common/empty'
import type {
  ClaimProofHeaderProps,
  ClaimProofHeaderNotchProps,
} from './type-claim-proof-header'
var { height, width } = Dimensions.get('screen')

export class ClaimProofHeaderNotch extends PureComponent<
  ClaimProofHeaderNotchProps,
  void
> {
  render() {
    const {
      containerStyle = empty,
      titleStyle = [],
    }: ClaimProofHeaderNotchProps = this.props
    return (
      <View style={styles.headerNotchContainer}>
        <View style={[styles.trapezoid, containerStyle]}>
          <CustomText h7 center style={[styles.sovrinText, titleStyle]}>
            SOVRIN TOKENS
          </CustomText>
        </View>
        <View style={[containerStyle, styles.triangle]} />
      </View>
    )
  }
}
export default class ClaimProofHeader extends PureComponent<
  ClaimProofHeaderProps,
  void
> {
  render() {
    const {
      message,
      title,
      logoUrl,
      testID,
      containerStyle = empty,
      textContainerStyle = [],
      messageStyle = [],
      titleStyle = [],
      payTokenValue,
    }: ClaimProofHeaderProps = this.props
    return (
      <CustomSafeAreaView>
        <CustomView
          testID={`${testID}-header`}
          fifth
          style={[styles.header, containerStyle, { marginBottom: -OFFSET_1X }]}
        >
          {this.props.children}
          <CustomView fifth center style={[styles.message, textContainerStyle]}>
            {message && (
              <CustomText h5 center demiBold bg="fifth" style={[messageStyle]}>
                {message}
              </CustomText>
            )}
            {title && (
              <CustomText
                h4
                heavy
                bg="fifth"
                style={[styles.title, titleStyle]}
              >
                {title}
              </CustomText>
            )}
            {payTokenValue && (
              <CustomView row horizontalSpace left>
                <CustomText
                  h4
                  uppercase
                  bg="fifth"
                  style={[styles.prefix, titleStyle]}
                >
                  pay
                </CustomText>
                <CustomText
                  h3
                  bg="fifth"
                  style={[styles.title, titleStyle]}
                  formatNumber
                >
                  {payTokenValue}
                </CustomText>
                <Icon
                  src={require('../../images/sovrinToken.png')}
                  small
                  iconStyle={[{ marginTop: OFFSET_3X / 2 }]}
                />
              </CustomView>
            )}
          </CustomView>
        </CustomView>
        {payTokenValue && (
          <ClaimProofHeaderNotch
            containerStyle={containerStyle}
            titleStyle={titleStyle}
          />
        )}
      </CustomSafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: (Platform.OS === 'ios' ? OFFSET_1X : 0) + 20,
    shadowColor: color.bg.secondary.color,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 4,
  },
  message: {
    marginTop: OFFSET_1X / 2,
    paddingBottom: OFFSET_1X,
    marginHorizontal: OFFSET_1X,
  },
  title: {
    marginTop: OFFSET_1X / 2,
  },
  prefix: {
    fontSize: font.size.PREFIX,
    marginTop: OFFSET_3X / 2,
  },
  sovrinText: {
    marginBottom: -OFFSET_1X,
  },
  headerNotchContainer: {
    zIndex: 5,
    backgroundColor: white,
  },
  trapezoid: {
    width: '100%',
    height: 0,
    borderBottomWidth: 20,
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    borderRightWidth: 0,
    borderRightColor: 'transparent',
    borderStyle: 'solid',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  triangle: {
    width: '95%',
    height: 0,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: width / 2.1,
    borderRightWidth: width / 2.1,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  },
})

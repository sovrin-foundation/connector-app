// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, Dimensions } from 'react-native'
import { CustomView, Icon, CustomText } from '../index'
import {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  BACKUP_BANNER_TEST_ID,
  BANNER_HEIGHT,
} from './banner-constants'
import { color, dangerBannerHeight } from '../../common/styles'
import type { DangerBannerProps } from './type-banner'

const { width } = Dimensions.get('window')
let deviceClass = ''
if (Platform.OS === 'ios') {
  deviceClass = width === 320 ? 'iPhone5' : 'other'
}

export default class DangerBanner extends PureComponent<
  DangerBannerProps,
  void
> {
  render() {
    return (
      <CustomView
        row
        vCenter
        horizontalSpace
        style={[styles.bannerContainer, this.props.style || {}]}
        onPress={this.props.onPress}
        testID={this.props.testID}
      >
        <Icon
          iconStyle={[styles.labelImage, { tintColor: 'white' }]}
          src={require('../../images/Alert.png')}
        />
        <CustomView horizontalSpace>
          <CustomText bold transparentBg h5>
            {this.props.bannerTitle}
          </CustomText>
          <CustomText transparentBg h6>
            {this.props.bannerSubtext}
          </CustomText>
        </CustomView>
      </CustomView>
    )
  }
}

const styles = StyleSheet.create({
  bannerContainer: {
    height: BANNER_HEIGHT + (deviceClass === 'iPhone5' ? 16 : 0),
    backgroundColor: color.actions.dangerous,
  },
  labelImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
})

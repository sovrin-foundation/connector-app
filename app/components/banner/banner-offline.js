// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { CustomView, Icon, CustomText } from '../index'
import {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  BACKUP_BANNER_TEST_ID,
  BANNER_HEIGHT,
} from './banner-constants'
import { color, dangerBannerHeight } from '../../common/styles'
import type { OfflineBannerProps } from './type-banner'

export class OfflineBanner extends PureComponent<OfflineBannerProps, void> {
  render() {
    return (
      <CustomView
        row
        vCenter
        horizontalSpace
        verticalSpace
        style={[styles.bannerContainer, this.props.style || {}]}
        onPress={this.props.onPress}
        testID={this.props.testID}
      >
        <CustomView horizontalSpace>
          <CustomText bold transparentBg center errorText h5>
            {this.props.bannerTitle}
          </CustomText>
        </CustomView>
      </CustomView>
    )
  }
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: color.palePink,
  },
})

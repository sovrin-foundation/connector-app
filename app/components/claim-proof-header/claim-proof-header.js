// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform } from 'react-native'
import {
  CustomView,
  CustomText,
  Icon,
  ImageColorPicker,
  ConnectionTheme,
} from '../../components'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  isiPhone5,
} from '../../common/styles'
import type { ClaimProofHeaderProps } from './type-claim-proof-header'

export default class ClaimProofHeader extends PureComponent<
  void,
  ClaimProofHeaderProps,
  void
> {
  render() {
    const {
      message,
      title,
      logoUrl,
      testID,
    }: ClaimProofHeaderProps = this.props

    return (
      <CustomView testID={`${testID}-header`} fifth style={[styles.header]}>
        {this.props.children}
        <CustomView fifth center style={[styles.message]}>
          <CustomText h5 center demiBold bg="fifth">
            {message}
          </CustomText>
          <CustomText h4 heavy bg="fifth" style={[styles.titleName]}>
            {title}
          </CustomText>
        </CustomView>
        <ImageColorPicker imageUrl={logoUrl} />
      </CustomView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: (Platform.OS === 'ios' ? OFFSET_2X : 0) + 20,
    shadowColor: color.bg.secondary.color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 4,
  },
  headerCloseIcon: {
    marginRight: 15,
  },

  message: {
    marginTop: OFFSET_1X / 2,
    paddingBottom: OFFSET_2X,
    marginHorizontal: OFFSET_1X,
  },
  titleName: {
    marginTop: OFFSET_1X / 2,
  },
})

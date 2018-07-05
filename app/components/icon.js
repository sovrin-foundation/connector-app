// @flow
import React from 'react'
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { CustomView } from './layout/custom-view'
import type { GenericObject } from '../common/type-common'

const empty = []

// TODO:KS Change GenericObject to actual props of icon
const Icon = (props: GenericObject) => {
  const {
    src,
    small,
    medium,
    mediumLarge,
    large,
    extraLarge,
    xxLarge,
    iconStyle = empty,
    testID,
    resizeMode = 'contain',
    halo,
    round,
    haloStyle = empty,
    onPress,
    onLongPress,
  } = props
  const size = small
    ? 'small'
    : medium
      ? 'medium'
      : extraLarge
        ? 'extraLarge'
        : mediumLarge ? 'mediumLarge' : xxLarge ? 'xxLarge' : 'large'
  const roundImageStyle =
    halo || round
      ? // $FlowFixMe flow does not support dynamic object key
        styles[`${size}RoundIcon`]
      : null
  let filteredProps = {}
  if (typeof props.testID !== 'undefined') {
    filteredProps.testID = testID
    filteredProps.accessible = true
    filteredProps.accessibilityLabel = testID
  }
  const iconImage = (
    <Image
      source={src}
      style={[styles[size], roundImageStyle, ...iconStyle]}
      resizeMode={resizeMode}
      {...filteredProps}
    />
  )

  let haloView
  if (halo) {
    // $FlowFixMe flow does not support dynamic object lookup
    const haloSizeStyle = styles[`${size}Halo`]
    haloView = (
      <CustomView center style={[haloSizeStyle, haloStyle]}>
        {iconImage}
      </CustomView>
    )
  }

  return (
    <CustomView clearBg {...props}>
      {halo ? haloView : iconImage}
    </CustomView>
  )
}

export default Icon

const size = {
  small: 20,
  medium: 30,
  mediumLarge: 40,
  large: 50,
  extraLarge: 80,
  xxLarge: 90,
}

const styles = StyleSheet.create({
  small: {
    width: size.small,
    height: size.small,
  },
  medium: {
    width: size.medium,
    height: size.medium,
  },
  mediumLarge: {
    width: size.mediumLarge,
    height: size.mediumLarge,
  },
  large: {
    width: size.large,
    height: size.large,
  },
  extraLarge: {
    width: size.extraLarge,
    height: size.extraLarge,
  },
  xxLarge: {
    width: size.xxLarge,
    height: size.xxLarge,
  },
  smallRoundIcon: {
    borderRadius: size.small / 2,
  },
  mediumRoundIcon: {
    borderRadius: size.medium / 2,
  },
  largeRoundIcon: {
    borderRadius: size.large / 2,
  },
  mediumLargeRoundIcon: {
    borderRadius: size.mediumLarge / 2,
  },
  extraLargeRoundIcon: {
    borderRadius: size.extraLarge / 2,
  },
  extraLargeHalo: {
    // we are assuming that halo will be at least 20pt larger than image
    borderRadius: (size.extraLarge + 20) / 2,
    width: size.extraLarge + 20,
    height: size.extraLarge + 20,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
})

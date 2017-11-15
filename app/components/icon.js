import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { CustomView } from './layout'
import empty from '../common/empty'

const Icon = props => {
  const {
    src,
    small,
    medium,
    mediumLarge,
    large,
    extraLarge,
    iconStyle = empty,
    testID,
    resizeMode = 'contain',
    halo,
    round,
    haloStyle = empty,
  } = props
  const size = small
    ? 'small'
    : medium
      ? 'medium'
      : extraLarge ? 'extraLarge' : mediumLarge ? 'mediumLarge' : 'large'
  const roundImageStyle = halo || round ? styles[`${size}RoundIcon`] : null
  const iconImage = (
    <Image
      source={src}
      style={[styles[size], roundImageStyle, ...iconStyle]}
      resizeMode={resizeMode}
      testID={testID}
    />
  )

  let haloView
  if (halo) {
    haloView = (
      <CustomView center style={[styles[`${size}Halo`], haloStyle]}>
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

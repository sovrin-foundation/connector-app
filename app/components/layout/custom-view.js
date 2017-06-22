import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { color } from '../../common/styles/constant'
import empty from '../../common/empty'
import style from './layout-style'

// CustomView is used for different types of background for our app
// default styles for a view such a padding, shadow or transparent background
export const CustomView = props => {
  const {
    clearBg,
    shadow,
    horizontalSpace,
    verticalSpace,
    pad,
    primary,
    secondary,
    tertiary,
    quarternary,
    row,
    left,
    right,
    center,
    hCenter,
    vCenter,
    bottom,
    onPress,
  } = props

  const passedStyles = props.style || empty

  // TODO:KS We can keep same name as style and use it directly with props
  const styles = StyleSheet.flatten([
    clearBg ? style.transparentBg : null,
    horizontalSpace ? style.horizontalSpaced : null,
    verticalSpace ? style.verticalSpaced : null,
    pad ? [style.horizontalSpaced, style.verticalSpaced] : null,
    primary ? style.primaryBg : null,
    secondary ? style.secondaryBg : null,
    tertiary ? style.tertiaryBg : null,
    quarternary ? style.quarternaryBg : null,
    row ? style.row : null,
    left ? style.left : null,
    right ? style.right : null,
    center ? style.center : null,
    hCenter ? style.hCenter : null,
    vCenter ? style.vCenter : null,
    row && bottom ? style.rowBottom : null,
    bottom && !row ? style.columnBottom : null,
    ...passedStyles,
  ])

  const customView = (
    <View {...props} style={styles}>
      {props.children}
    </View>
  )

  if (onPress) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {customView}
      </TouchableWithoutFeedback>
    )
  }

  return customView
}

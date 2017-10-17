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
    horizontalSpace,
    verticalSpace,
    doubleVerticalSpace,
    pad,
    primary,
    secondary,
    tertiary,
    quaternary,
    fifth,
    senary,
    row,
    left,
    right,
    center,
    hCenter,
    vCenter,
    bottom,
    onPress,
    spaceBetween,
    shadow,
    imageShadow,
    absolute,
    absoluteFill,
    spaceAround,
  } = props
  const passedStyles = props.style || empty
  const absoluteStyles = absolute
    ? [style.absolute, style[`absolute${absolute}`]]
    : empty

  // TODO:KS We can keep same name as style and use it directly with props
  const styles = StyleSheet.flatten([
    clearBg ? style.transparentBg : null,
    horizontalSpace ? style.horizontalSpaced : null,
    verticalSpace ? style.verticalSpaced : null,
    doubleVerticalSpace ? style.doubleVerticalSpaced : null,
    pad ? [style.horizontalSpaced, style.verticalSpaced] : null,
    primary ? style.primaryBg : null,
    secondary ? style.secondaryBg : null,
    tertiary ? style.tertiaryBg : null,
    quaternary ? style.quaternaryBg : null,
    fifth ? style.fifthBg : null,
    senary ? style.senaryBg : null,
    row ? style.row : null,
    left ? style.left : null,
    right ? style.right : null,
    center ? style.center : null,
    hCenter ? style.hCenter : null,
    vCenter ? style.vCenter : null,
    row && bottom ? style.rowBottom : null,
    bottom && !row ? style.columnBottom : null,
    spaceBetween ? style.spaceBetween : null,
    shadow ? style.shadow : null,
    imageShadow ? style.imageShadow : null,
    spaceAround ? style.spaceAround : null,
    ...absoluteStyles,
    ...passedStyles,
  ])

  const customView = (
    <View {...props} style={styles}>
      {props.children}
    </View>
  )

  const touchableTestId = props.testID ? `${props.testID}-touchable` : undefined

  if (onPress) {
    return (
      <TouchableWithoutFeedback testID={touchableTestId} onPress={onPress}>
        {customView}
      </TouchableWithoutFeedback>
    )
  }

  return customView
}

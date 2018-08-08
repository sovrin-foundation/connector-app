// @flow
import React from 'react'
import { Text, Animated, StyleSheet } from 'react-native'
import empty from '../common/empty'
import { color, font } from '../common/styles/constant'
import debounce from 'lodash.debounce'
import type { GenericObject } from '../common/type-common'

export function formatNumbers(num: string) {
  if (num) {
    let numStr = num.toString().split('.')
    numStr[0] = numStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numStr.join('.')
  }
  return num
}

//TODO: Default font color should be tertiary and background should also be tertiary.
const CustomText = (props: GenericObject) => {
  const {
    h3,
    h3a,
    h4,
    h4a,
    h5,
    h6,
    h7,
    bold,
    thick,
    semiBold,
    demiBold,
    center,
    bg = 'primary',
    primary,
    secondary,
    tertiary,
    quaternary,
    quinaryText,
    errorText,
    borderColor,
    style = [],
    testID,
    onPress,
    onLongPress,
    transparentBg,
    uppercase,
    heavy,
    numberOfLines,
    formatNumber,
    fullWidth,
    adjustsFontSizeToFit,
    allowFontScaling,
    animated,
    charcoal,
    secondaryColor,
    darkgray,
    medium,
  } = props

  const colorType = quaternary
    ? 'Quaternary'
    : secondary ? 'Secondary' : tertiary ? 'Tertiary' : 'Primary'
  const size = h3
    ? 'h3'
    : h3a ? 'h3a' : h4 ? 'h4' : h4a ? 'h4a' : h6 ? 'h6' : h7 ? 'h7' : 'h5'
  const fontFamily = 'fontLato'
  const textStyles = [
    styles[size],
    styles[fontFamily],
    // $FlowFixMe Flow does not support below syntax for type checking
    styles[`${bg}Bg${colorType}`],
    bold
      ? styles.bold
      : semiBold
        ? styles.semiBold
        : thick
          ? styles.thick
          : demiBold
            ? styles.demiBold
            : heavy ? styles.heavy : medium ? styles.medium : null,
    center ? styles.center : null,
    transparentBg ? styles.transparentBg : null,
    quinaryText ? styles.orangeText : null,
    errorText ? styles.errorText : null,
    borderColor ? styles.borderColor : null,
    primary ? styles.primary : null,
    fullWidth ? styles.fullWidth : null,
    charcoal ? styles.colorCharcoal : null,
    secondaryColor ? styles.greyColor : null,
    darkgray ? styles.darkgray : null,
    ...style,
  ]
  const TextComponent = animated ? Animated.Text : Text

  let filteredProps = {}
  if (typeof onLongPress !== 'undefined') {
    filteredProps.onLongPress = onLongPress
  }
  if (typeof testID !== 'undefined') {
    filteredProps.testID = testID
    filteredProps.accessible = true
    filteredProps.accessibilityLabel = testID
  }
  if (typeof onPress !== 'undefined') {
    filteredProps.onPress = debounce(
      event => {
        onPress(event)
      },
      300,
      { leading: true, trailing: false }
    )
  }
  if (typeof numberOfLines !== 'undefined') {
    filteredProps.numberOfLines = numberOfLines
  }
  let textChild = props.children
  if (uppercase) {
    textChild = props.children.toUpperCase()
  }
  if (formatNumber) {
    textChild = formatNumbers(props.children)
  }
  if (adjustsFontSizeToFit) {
    filteredProps.adjustsFontSizeToFit = adjustsFontSizeToFit
  }
  if (allowFontScaling) {
    filteredProps.allowFontScaling = allowFontScaling
  }

  return (
    <TextComponent style={textStyles} {...filteredProps}>
      {textChild}
    </TextComponent>
  )
}

export default CustomText
//TODO h should start with h1 to h4
export const styles = StyleSheet.create({
  h3: {
    fontSize: font.size.L,
  },
  h3a: {
    fontSize: font.size.L1,
  },
  h4a: {
    fontSize: font.size.M1,
  },
  h4: {
    fontSize: font.size.ML,
  },
  h5: {
    fontSize: font.size.M,
  },
  h6: {
    fontSize: font.size.S,
  },
  h7: {
    fontSize: font.size.XS,
  },
  medium: {
    fontWeight: '500',
  },
  semiBold: {
    fontWeight: '600',
  },
  demiBold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: 'bold',
  },
  thick: {
    fontWeight: '800',
  },
  heavy: {
    fontWeight: '900',
  },
  center: {
    textAlign: 'center',
  },
  primaryBgPrimary: {
    color: color.bg.primary.font.primary,
    backgroundColor: color.bg.primary.color,
  },
  primaryBgSecondary: {
    color: color.bg.primary.font.secondary,
    backgroundColor: color.bg.primary.color,
  },
  primaryBgTertiary: {
    color: color.bg.primary.font.tertiary,
    backgroundColor: color.bg.primary.color,
  },
  fifthBgPrimary: {
    color: color.bg.fifth.font.primary,
    backgroundColor: color.bg.fifth.color,
  },
  fifthBgTertiary: {
    color: color.bg.fifth.font.primary,
    backgroundColor: color.bg.tertiary.color,
  },
  tertiaryBgPrimary: {
    color: color.bg.tertiary.font.primary,
    backgroundColor: color.bg.tertiary.color,
  },
  tertiaryBgTertiary: {
    color: color.bg.tertiary.font.tertiary,
    backgroundColor: color.bg.tertiary.color,
  },
  septenaryBgPrimary: {
    color: color.bg.tertiary.font.primary,
    backgroundColor: color.bg.seventh.color,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  orangeText: {
    color: color.bg.eighth.color,
  },
  errorText: {
    color: color.bg.tenth.font.color,
  },
  borderColor: {
    borderWidth: 2,
    borderColor: color.bg.eighth.border.color,
  },
  primary: {
    color: color.bg.primary.color,
  },
  fontLato: {
    fontFamily: 'Lato',
  },
  fullWidth: {
    width: '100%',
  },
  colorCharcoal: {
    color: color.textColor.charcoal,
  },
  greyColor: {
    color: color.textColor.grey,
  },
  darkgray: {
    color: color.textColor.darkgray,
  },
})

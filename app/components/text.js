import React from 'react'
import { Text, StyleSheet } from 'react-native'
import empty from '../common/empty'
import { color, font } from '../common/styles/constant'
//TODO: Default font color should be tertiary and background should also be tertiary.
const CustomText = props => {
  const {
    h4,
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
    proText,
    tertiary,
    quaternary,
    style = empty,
    testID,
    onPress,
    transparentBg,
    uppercase,
    heavy,
  } = props

  const colorType = quaternary
    ? 'Quaternary'
    : secondary ? 'Secondary' : tertiary ? 'Tertiary' : 'Primary'
  const size = h4 ? 'h4' : h6 ? 'h6' : h7 ? 'h7' : 'h5'
  const fontFamily = proText ? 'fontFamilySFProText' : 'fontFamilySFProDisplay'
  const textStyles = [
    styles[size],
    styles[fontFamily],
    styles[`${bg}Bg${colorType}`],
    bold
      ? styles.bold
      : semiBold
        ? styles.semiBold
        : thick
          ? styles.thick
          : demiBold ? styles.demiBold : heavy ? styles.heavy : null,
    center ? styles.center : null,
    transparentBg ? styles.transparentBg : null,
    ...style,
  ]

  return (
    <Text style={textStyles} onPress={onPress} testID={testID}>
      {uppercase
        ? props.children.toUpperCase
          ? props.children.toUpperCase()
          : props.children
        : props.children}
    </Text>
  )
}

export default CustomText
//TODO h should start with h1 to h4
export const styles = StyleSheet.create({
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
  tertiaryBgPrimary: {
    color: color.bg.tertiary.font.primary,
    backgroundColor: color.bg.tertiary.color,
  },
  tertiaryBgTertiary: {
    color: color.bg.tertiary.font.tertiary,
    backgroundColor: color.bg.tertiary.color,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  fontFamilySFProDisplay: {
    fontFamily: 'SF Pro Display',
  },
  fontFamilySFProText: {
    fontFamily: 'SF Pro Text',
  },
})

import React from 'react'
import { Text, StyleSheet } from 'react-native'
import empty from '../common/empty'
import { color, font } from '../common/styles/constant'

const CustomText = props => {
  const {
    h1,
    h01,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
    bold,
    semiBold,
    center,
    bg = 'primary',
    primary,
    secondary,
    tertiary,
    quaternary,
    style = empty,
    testID,
    onPress,
    transparentBg,
    uppercase,
  } = props

  const colorType = quaternary
    ? 'Quaternary'
    : secondary ? 'Secondary' : tertiary ? 'Tertiary' : 'Primary'
  const size = h1
    ? 'h1'
    : h01
      ? 'h01'
      : h2 ? 'h2' : h3 ? 'h3' : h4 ? 'h4' : h6 ? 'h6' : h7 ? 'h7' : 'h5'
  const textStyles = [
    styles[size],
    styles[`${bg}Bg${colorType}`],
    bold ? styles.bold : semiBold ? styles.semiBold : null,
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

export const styles = StyleSheet.create({
  h1: {
    fontSize: font.size.XXXL,
  },
  h01: {
    fontSize: font.size.XXL,
  },
  h2: {
    fontSize: font.size.XL,
  },
  h3: {
    fontSize: font.size.L,
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
  semiBold: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
  center: {
    textAlign: 'center',
  },
  primaryBgPrimary: {
    color: color.bg.primary.font.primary,
  },
  center: {
    textAlign: 'center',
  },
  fifthBgPrimary: {
    color: color.bg.fifth.font.primary,
    backgroundColor: 'transparent',
  },
  primaryBgSecondary: {
    color: color.bg.primary.font.secondary,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
})

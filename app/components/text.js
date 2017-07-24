import React from 'react'
import { Text, StyleSheet } from 'react-native'
import empty from '../common/empty'
import { color, font } from '../common/styles/constant'

const CustomText = props => {
  const {
    h1,
    h2,
    h3,
    h4,
    h5,
    bold,
    center,
    bg = 'primary',
    primary,
    secondary,
    tertiary,
    quarternary,
    style = empty,
    testID,
    onPress,
  } = props

  const colorType = quarternary
    ? 'Quarternary'
    : secondary ? 'Secondary' : tertiary ? 'Tertiary' : 'Primary'
  const size = h1 ? 'h1' : h2 ? 'h2' : h3 ? 'h3' : h4 ? 'h4' : 'h5'
  const textStyles = [
    styles[size],
    styles[`${bg}Bg${colorType}`],
    bold ? styles.bold : null,
    ...style,
  ]

  return (
    <Text style={textStyles} onPress={onPress} testID={testID}>
      {props.children}
    </Text>
  )
}

export default CustomText

const styles = StyleSheet.create({
  h1: {
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
  bold: {
    fontWeight: 'bold',
  },
  primaryBgPrimary: {
    color: color.bg.primary.font.primary,
  },
})

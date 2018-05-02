import React from 'react'
import { Text, StyleSheet } from 'react-native'
import empty from '../common/empty'
import { color, font } from '../common/styles/constant'
import debounce from 'lodash.debounce'

// to format the number 1234 -> 1,234
export function formatNumbers(num: string) {
  if (num) {
    let numStr = num.toString().split('.')
    numStr[0] = numStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numStr.join('.')
  }
  return num
}

//TODO: Default font color should be tertiary and background should also be tertiary.
const CustomText = props => {
  const {
    h3,
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
    quinaryText,
    borderColor,
    style = empty,
    testID,
    onPress,
    onLongPress,
    transparentBg,
    uppercase,
    heavy,
    numberOfLines,
    formatNumber,
  } = props

  const colorType = quaternary
    ? 'Quaternary'
    : secondary ? 'Secondary' : tertiary ? 'Tertiary' : 'Primary'
  const size = h3 ? 'h3' : h4 ? 'h4' : h6 ? 'h6' : h7 ? 'h7' : 'h5'
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
    quinaryText ? styles.orangeText : null,
    borderColor ? styles.borderColor : null,
    primary ? styles.primary : null,
    ...style,
  ]
  let filteredProps = {}
  if (typeof onLongPress !== 'undefined') {
    filteredProps.onLongPress = onLongPress
  }
  if (typeof testID !== 'undefined') {
    filteredProps.testID = testID
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

  return (
    <Text style={textStyles} {...filteredProps}>
      {textChild}
    </Text>
  )
}

export default CustomText
//TODO h should start with h1 to h4
export const styles = StyleSheet.create({
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
  transparentBg: {
    backgroundColor: 'transparent',
  },
  orangeText: {
    color: color.bg.eighth.color,
  },
  borderColor: {
    borderWidth: 2,
    borderColor: color.bg.eighth.border.color,
  },
  primary: {
    color: color.bg.primary.color,
  },
  fontFamilySFProDisplay: {
    fontFamily: 'SF Pro Display',
  },
  fontFamilySFProText: {
    fontFamily: 'SF Pro Text',
  },
})

// @flow
import React from 'react'
import { StyleSheet } from 'react-native'
const size = {
  small: 50,
  medium: 76,
  large: 100,
}

export default StyleSheet.create({
  small: {
    width: size.small,
    height: size.small,
  },
  medium: {
    width: size.medium,
    height: size.medium,
  },
  large: {
    width: size.large,
    height: size.large,
  },
  smallRound: {
    borderRadius: size.small / 2,
  },
  mediumRound: {
    borderRadius: size.medium / 2,
  },
  largeRound: {
    borderRadius: size.large / 2,
  },
  clearBg: {
    backgroundColor: 'transparent',
  },
})

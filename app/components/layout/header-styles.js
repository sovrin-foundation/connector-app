// @flow
import React from 'react'
import { StyleSheet } from 'react-native'

import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  color,
  OFFSET_1X,
  OFFSET_3X,
  OFFSET_2X,
} from '../../common/styles/constant'

// TODO:KS Move this file to common/styles

const commonStyles = {
  borderBottomWidth: 0,
  padding: 0,
  shadowColor: 'transparent',
  shadowOpacity: 0,
  shadowOffset: {
    height: 0,
  },
  shadowRadius: 0,
  elevation: 0,
}

export default StyleSheet.create({
  header: {
    backgroundColor: color.bg.secondary.color,
    minHeight: 75,
    ...commonStyles,
  },
  headerLeft: {
    marginLeft: OFFSET_3X / 2,
  },
})

export const tertiaryHeaderStyles = StyleSheet.create({
  header: {
    backgroundColor: color.bg.tertiary.color,
    minHeight: 64,
    paddingHorizontal: OFFSET_2X,
    ...commonStyles,
  },
})

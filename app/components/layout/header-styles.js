// @flow
import React from 'react'
import { StyleSheet } from 'react-native'

import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  color,
  OFFSET_1X,
  OFFSET_3X,
} from '../../common/styles/constant'

export default StyleSheet.create({
  header: {
    backgroundColor: color.bg.secondary.color,
    borderBottomWidth: 0,
    minHeight: 75,
    padding: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
  },
  headerLeft: {
    marginLeft: OFFSET_3X / 2,
  },
})

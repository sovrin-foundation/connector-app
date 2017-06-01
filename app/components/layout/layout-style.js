import React from 'react'
import { StyleSheet } from 'react-native'

import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  color,
} from '../../common/styles/constant'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  horizontalSpaced: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  verticalSpaced: {
    paddingVertical: PADDING_VERTICAL,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  primaryBg: {
    backgroundColor: color.bg.primary.color,
  },
  secondaryBg: {
    backgroundColor: color.bg.secondary.color,
  },
  tertiaryBg: {
    backgroundColor: color.bg.tertiary.color,
  },
  quarternaryBg: {
    backgroundColor: color.bg.quarternary.color,
  },
  left: {
    // this is assuming that we are aliging items in cloumn
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hCenter: {
    justifyContent: 'center',
  },
  vCenter: {
    alignItems: 'center',
  },
  rowBottom: {
    alignItems: 'flex-end',
  },
  columnBottom: {
    justifyContent: 'flex-end',
  },
})

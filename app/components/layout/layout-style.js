import React from 'react'
import { StyleSheet } from 'react-native'

import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  color,
  OFFSET_1X,
  OFFSET_2X,
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
  quaternaryBg: {
    backgroundColor: color.bg.quaternary.color,
  },
  fifthBg: {
    backgroundColor: color.bg.fifth.color,
  },
  left: {
    // this is assuming that we are aligning items in column
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
  spaceBetween: {
    justifyContent: 'space-between',
  },
  list: {
    marginHorizontal: OFFSET_2X,
  },
  listItem: {
    marginVertical: OFFSET_2X,
  },
})

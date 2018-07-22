// @flow
import React from 'react'
import { StyleSheet, Platform } from 'react-native'

import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  color,
  font,
  whisper,
  whiteSmokeSecondary,
  OFFSET_1X,
  OFFSET_3X,
  OFFSET_2X,
  OFFSET_9X,
} from '../../common/styles/constant'

// TODO:KS Move this file to common/styles

const commonStyles = {
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
    borderBottomWidth: 0,
    ...commonStyles,
  },
  headerLeft: {
    marginLeft: OFFSET_3X / 2,
  },
  headerLogoContainer: {
    height: OFFSET_9X + (Platform.OS === 'ios' ? 0 : OFFSET_1X),
  },
  clearBg: { backgroundColor: 'transparent' },
  centerTitle: {
    alignSelf: 'center',
  },
})

export const primaryHeaderStyles = StyleSheet.create({
  header: {
    backgroundColor: whiteSmokeSecondary,
    borderBottomColor: whisper,
    borderBottomWidth: 1,
    ...commonStyles,
  },
})

export const tertiaryHeaderStyles = StyleSheet.create({
  header: {
    backgroundColor: color.bg.tertiary.color,
    minHeight: 64,
    paddingHorizontal: OFFSET_2X,
    borderBottomWidth: 0,
    ...commonStyles,
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: font.size.M,
    fontWeight: '600',
    color: color.bg.tertiary.font.tertiary,
  },
})

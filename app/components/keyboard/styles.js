// @flow

import { StyleSheet, Dimensions, Platform } from 'react-native'
import {
  isBiggerThanShortDevice,
  deviceHeight,
  MEDIUM_DEVICE,
} from '../../common/styles/constant'
import { PUSH_NOTIFICATION_PERMISSION } from '../../push-notification/type-push-notification'

const ROW_MARGIN = isBiggerThanShortDevice ? 36 : 15
const FIRST_ROW_MARGIN = isBiggerThanShortDevice ? 24 : 8

const ROW_HEIGHT =
  Platform.OS === 'ios' ? 36 : deviceHeight < MEDIUM_DEVICE ? 27 : 36

const FONT_SIZE = isBiggerThanShortDevice ? 28 : 26
export const INPUT_RANGE = [0, 0.5, 1]
export const OUTPUT_RANGE =
  Platform.OS === 'ios'
    ? isBiggerThanShortDevice ? [28, 29, 30] : [26, 30, 34]
    : deviceHeight < MEDIUM_DEVICE ? [28, 30, 32] : [26, 30, 34]

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 32, // TODO: update style guide to reflect new constant
    marginBottom: 5,
  },
  firstRow: {
    height: ROW_HEIGHT,
    marginTop: FIRST_ROW_MARGIN,
  },
  row: {
    height: ROW_HEIGHT,
    marginTop: ROW_MARGIN,
  },
  number: {
    fontSize: FONT_SIZE,
    fontWeight: '500', // TODO: update style guide to reflect new constant
  },
})

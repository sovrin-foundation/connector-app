// @flow

import { StyleSheet, Dimensions } from 'react-native'
import { SHORT_DEVICE } from '../../common/styles/constant'
import { PUSH_NOTIFICATION_PERMISSION } from '../../push-notification/type-push-notification'

const { height } = Dimensions.get('window')

const ROW_MARGIN = height > SHORT_DEVICE ? 36 : 15
const FIRST_ROW_MARGIN = height > SHORT_DEVICE ? 24 : 8
const ROW_HEIGHT = height > SHORT_DEVICE ? 36 : 30
const FONT_SIZE = height > SHORT_DEVICE ? 28 : 26
export const INPUT_RANGE = [0, 0.5, 1]
export const OUTPUT_RANGE = height > SHORT_DEVICE ? [28, 34, 40] : [26, 30, 34]

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 32, // TODO: update style guide to reflect new constant
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

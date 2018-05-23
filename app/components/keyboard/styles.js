// @flow

import { StyleSheet, Dimensions } from 'react-native'
import { SHORT_DEVICE } from '../../common/styles/constant'
import { PUSH_NOTIFICATION_PERMISSION } from '../../push-notification/type-push-notification'

const { height } = Dimensions.get('window')

const ROW_MARGIN = height > SHORT_DEVICE ? 36 : 22
const FIRST_ROW_MARGIN = height > SHORT_DEVICE ? 24 : 8
const ROW_HEIGHT = 33

const styles = StyleSheet.create({
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
    fontSize: 28, // TODO: update style guide to reflect new constant
    fontWeight: '500', // TODO: update style guide to reflect new constant
  },
})

export default styles

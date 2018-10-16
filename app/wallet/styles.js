// @flow
import { StyleSheet, Dimensions } from 'react-native'
import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  isBiggerThanShortDevice,
  color,
} from '../common/styles/constant'

const { width } = Dimensions.get('window')
const SPACE_FILLER = 50
const amountSpacing = isBiggerThanShortDevice ? PADDING_VERTICAL * 2 : 0
const ctaButtonHeight = isBiggerThanShortDevice ? 63 : 43

const styles = StyleSheet.create({
  headerCloseIcon: {
    marginTop: PADDING_VERTICAL,
  },
  ctaButton: {
    flex: -1,
    height: ctaButtonHeight,
    borderRadius: 5,
    backgroundColor: color.bg.eighth.color,
    margin: '5%',
  },
  alignItemsCenter: {
    marginBottom: 6,
    marginHorizontal: '5%',
  },
  verticalSpacing: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around',
  },
})

export default styles

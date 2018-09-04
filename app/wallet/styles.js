// @flow
import { StyleSheet, Dimensions } from 'react-native'
import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  SHORT_DEVICE,
  color,
} from '../common/styles/constant'

const { height } = Dimensions.get('window')
const amountSpacing = height > SHORT_DEVICE ? PADDING_VERTICAL * 2 : 0
const ctaButtonHeight = height > SHORT_DEVICE ? 63 : 43

const styles = StyleSheet.create({
  headerCloseIcon: {
    marginTop: PADDING_VERTICAL,
  },
  ctaButton: {
    width: '100%',
    height: ctaButtonHeight,
    borderRadius: 5,
    backgroundColor: color.bg.eighth.color,
  },
  alignItemsCenter: {
    marginBottom: 6,
    marginLeft: '5%',
    marginRight: '5%',
  },
  verticalSpacing: {
    paddingTop: amountSpacing,
  },
})

export default styles

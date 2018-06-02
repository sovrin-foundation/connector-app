// @flow
import { StyleSheet, Dimensions } from 'react-native'
import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  SHORT_DEVICE,
  color,
} from '../common/styles/constant'

const { width, height } = Dimensions.get('window')
const SPACE_FILLER = 50
const amountSpacing = height > SHORT_DEVICE ? PADDING_VERTICAL * 2 : 0
const ctaButtonHeight = height > SHORT_DEVICE ? 63 : 43

const styles = StyleSheet.create({
  tabContainer: {
    maxHeight: 60,
  },
  headerCloseIcon: {
    marginTop: PADDING_VERTICAL,
    marginRight: PADDING_HORIZONTAL,
  },
  headerSpacer: {
    height: '100%',
    width: SPACE_FILLER,
  },
  sovrinLogoWrapper: {
    paddingTop: 10,
  },
  balanceHeader: {
    paddingBottom: 15,
    width: width - SPACE_FILLER * 2,
    alignSelf: 'center',
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

import { StyleSheet, Dimensions } from 'react-native'
import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../common/styles/constant'

const { width } = Dimensions.get('window')
const SPACE_FILLER = 50

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
})

export default styles

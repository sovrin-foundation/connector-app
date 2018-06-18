// @flow
import { StyleSheet, Dimensions, Platform } from 'react-native'
import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  SHORT_DEVICE,
  color,
  grey,
} from '../common/styles/constant'

const { width, height } = Dimensions.get('window')
const SPACE_FILLER = 50
const amountSpacing = height > SHORT_DEVICE ? PADDING_VERTICAL * 2 : 0
const submitButtonHeight = height > SHORT_DEVICE ? 63 : 43
const showRecoveryButtonHeight = height > SHORT_DEVICE ? 150 : 100
const inputBoxHeight = height > SHORT_DEVICE && Platform.OS === 'ios' ? 137 : 40

const styles = StyleSheet.create({
  tabContainer: {
    maxHeight: 60,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    transform: [{ rotate: '135deg' }],
  },
  headerCloseIcon: {
    marginRight: PADDING_HORIZONTAL,
    marginBottom: PADDING_VERTICAL,
    alignSelf: 'flex-end',
  },
  headerIcon: {
    marginRight: PADDING_HORIZONTAL,
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  headerBackIcon: {
    marginLeft: PADDING_HORIZONTAL,
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  headerSpacer: {
    height: '100%',
    width: SPACE_FILLER,
  },
  showRecoveryPassphrase: {
    width: '86%',
    height: showRecoveryButtonHeight,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: color.bg.tertiary.color,
    elevation: 7,
    marginBottom: 60,
  },
  genRecovery: {
    backgroundColor: color.bg.eleventh.color,
  },
  genRecoveryWrapper: {
    height: 80,
  },
  genRecoveryHeader: {
    width: '100%',
  },
  genRecoveryPhraseContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  genRecoveryPhrase: {
    textAlign: 'center',
    color: color.bg.eleventh.color,
    fontSize: 20,
    lineHeight: 30,
    fontFamily: 'Lato',
    fontWeight: '900',
  },
  genRecoveryText: {
    marginBottom: 20,
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
  genRecoveryMessage: {
    marginBottom: 40,
    paddingHorizontal: 20,
    alignSelf: 'center',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    fontFamily: 'Lato',
  },
  genRecoverySecondMessage: {
    marginBottom: 40,
    paddingHorizontal: 20,
    alignSelf: 'center',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
    fontFamily: 'Lato',
  },
  genRecoverySmallMessage: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 'bold',
    fontFamily: 'Lato',
    marginBottom: 30,
  },
  verifyMainContainer: {
    flex: 1,
    backgroundColor: color.bg.twelfth.color,
  },
  verifyMainText: {
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  inputBox: {
    marginBottom: 24,
    marginRight: 20,
    marginLeft: 20,
    height: inputBoxHeight,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.33)',
    color: 'white',
    padding: 10,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginLeft: '2%',
    marginRight: '2%',
    marginBottom: 15,
    borderRadius: 5,
    shadowColor: grey,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 7,
    height: height > SHORT_DEVICE ? 63 : 43,
  },
  backgroundImageVerify: {
    flex: 1,
    position: 'absolute',
  },
  verifyTitle: {
    fontSize: 22,
    marginBottom: 20,
    width: '100%',
  },
  exportBackup: {
    backgroundColor: color.bg.thirteenth.color,
  },
  wrapper: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    width: '100%',
  },
  exportBackupText: {
    marginBottom: 20,
    backgroundColor: color.bg.thirteenth.color,
    alignSelf: 'center',
    fontSize: 22,
  },
  exportBackupMessage: {
    backgroundColor: color.bg.thirteenth.color,
    alignSelf: 'center',
    fontSize: 18,
  },
  exportBackupSmallMessage: {
    backgroundColor: color.bg.thirteenth.color,
    alignSelf: 'center',
    fontSize: 14,
  },
  backupComplete: {
    backgroundColor: color.bg.fourteenth.color,
  },
  backupCompleteHeader: {
    width: '100%',
  },
  backupCompleteText: {
    marginBottom: 20,
    backgroundColor: color.bg.fourteenth.color,
    alignSelf: 'center',
    fontSize: 22,
  },
  backupCompleteMessage: {
    backgroundColor: color.bg.fourteenth.color,
    alignSelf: 'center',
    fontSize: 18,
  },
  backupCompleteSmallMessage: {
    backgroundColor: color.bg.fourteenth.color,
    alignSelf: 'center',
    fontSize: 14,
  },
  alignItemsCenter: {
    marginBottom: 6,
    marginLeft: '5%',
    marginRight: '5%',
  },
  verticalSpacing: {
    paddingTop: amountSpacing,
  },
  customButtonColor: {
    fontWeight: '600',
    fontSize: 18,
  },
})

export default styles

// @flow
import { StyleSheet, Dimensions, Platform } from 'react-native'
import {
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  isBiggerThanShortDevice,
  color,
  grey,
} from '../common/styles/constant'

const { width, height } = Dimensions.get('window')
const SPACE_FILLER = 50
const amountSpacing = isBiggerThanShortDevice ? PADDING_VERTICAL * 2 : 0
const submitButtonHeight = isBiggerThanShortDevice ? 63 : 43
const showRecoveryButtonHeight = isBiggerThanShortDevice ? 150 : 100
const inputBoxHeight =
  isBiggerThanShortDevice || Platform.OS === 'ios' ? 137 : 40
export const chatBubbleTextOffset = 40
const styles = StyleSheet.create({
  tabContainer: {
    maxHeight: 60,
  },
  backgroundImage: {
    width: '100%',
    flex: 1,
    position: 'absolute',
  },
  headerCloseIcon: {
    marginRight: PADDING_HORIZONTAL,
    marginBottom: PADDING_VERTICAL,
    alignSelf: 'flex-end',
  },
  headerIcon: {
    marginRight: isBiggerThanShortDevice ? 5 : 0,
    marginTop: isBiggerThanShortDevice ? 15 : 0,
    alignSelf: 'flex-end',
  },
  headerBackIcon: {
    marginLeft: isBiggerThanShortDevice ? 5 : 0,
    marginTop: isBiggerThanShortDevice ? 15 : 5,
    alignSelf: 'flex-start',
  },
  headerSpacer: {
    height: '100%',
    width: isBiggerThanShortDevice ? SPACE_FILLER : SPACE_FILLER * 3 / 4,
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
  genRecoveryHeader: {
    width: '100%',
  },
  genRecoveryPhraseContainer: {
    position: 'absolute',
    top: 20,
    left: chatBubbleTextOffset / 2,
    paddingHorizontal: '7%',
  },
  genRecoveryPhraseLoadingContainer: {
    padding: 40,
    position: 'absolute',
    top: 0,
  },
  genRecoveryPhrase: {
    textAlign: 'center',
    color: color.bg.eleventh.color,
    fontSize: isBiggerThanShortDevice ? 20 : 18,
    lineHeight: isBiggerThanShortDevice ? 30 : 28,
    fontWeight: '900',
  },
  genRecoveryText: {
    marginBottom: isBiggerThanShortDevice ? 10 : '2%',
    alignSelf: 'center',
    fontSize: isBiggerThanShortDevice ? 22 : 20,
    fontWeight: '600',
  },
  genRecoveryMessage: {
    paddingHorizontal: 20,
    alignSelf: 'center',
    fontSize: isBiggerThanShortDevice ? 18 : 16,
    lineHeight: isBiggerThanShortDevice ? 22 : 20,
    fontWeight: '500',
    marginBottom: isBiggerThanShortDevice ? 20 : 5,
  },
  genRecoverySecondMessage: {
    paddingHorizontal: 20,
    alignSelf: 'center',
    fontSize: isBiggerThanShortDevice ? 18 : 16,
    lineHeight: isBiggerThanShortDevice ? 22 : 20,
    fontWeight: 'bold',
  },
  genRecoverySmallMessage: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 'bold',
    marginBottom: isBiggerThanShortDevice ? 15 : '3%',
  },
  verifyMainContainer: {
    flex: 1,
    backgroundColor: color.bg.twelfth.color,
  },
  verifyMainText: {
    paddingHorizontal: 20,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: isBiggerThanShortDevice ? 40 : 20,
    marginBottom: isBiggerThanShortDevice ? 40 : 20,
  },
  exportBackupMainText: {
    paddingHorizontal: 10,
    fontSize: isBiggerThanShortDevice ? 18 : 16,
    lineHeight: isBiggerThanShortDevice ? 22 : 20,
    fontWeight: '500',
  },
  inputBox: {
    marginBottom: 24,
    marginRight: 20,
    marginLeft: 20,
    height: inputBoxHeight,
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
    height: isBiggerThanShortDevice ? 53 : 43,
  },
  backgroundImageVerify: {
    flex: 1,
    position: 'absolute',
  },
  exportBackup: {
    backgroundColor: color.bg.thirteenth.color,
  },
  wrapper: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  title: {
    fontWeight: '600',
    lineHeight: isBiggerThanShortDevice ? 27 : 22,
    fontSize: isBiggerThanShortDevice ? 22 : 20,
    marginBottom: isBiggerThanShortDevice ? 20 : 10,
    width: '100%',
  },
  exportBackupTitle: {
    fontWeight: '600',
    lineHeight: isBiggerThanShortDevice ? 27 : 22,
    fontSize: isBiggerThanShortDevice ? 22 : 20,
    marginBottom: isBiggerThanShortDevice ? 30 : 10,
    marginTop: isBiggerThanShortDevice ? 10 : 0,
    maxWidth: 290,
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
  exportBackupFile: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
  },
  exportBackupSmallMessage: {
    fontSize: 14,
    maxWidth: 300,
    lineHeight: 17,
    marginBottom: isBiggerThanShortDevice ? 30 : 10,
  },
  backupComplete: {
    backgroundColor: color.bg.fourteenth.color,
  },
  backupCompleteHeader: {
    width: '100%',
  },
  backupCompleteText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 22,
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
  lockIconImage: {
    paddingTop: isBiggerThanShortDevice ? 40 : '2%',
  },
  imageIcon: {
    resizeMode: 'stretch',
    width: '100%',
    marginBottom: isBiggerThanShortDevice ? 20 : 0,
  },
  imageIconEncryptFile: {
    resizeMode: 'contain',
    width: isBiggerThanShortDevice ? '100%' : '80%',
    marginBottom: isBiggerThanShortDevice ? 20 : 0,
  },
})

export default styles

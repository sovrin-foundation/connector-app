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
const inputBoxHeight = height > SHORT_DEVICE || Platform.OS === 'ios' ? 137 : 40

const styles = StyleSheet.create({
  tabContainer: {
    maxHeight: 60,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
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
  genRecoveryHeader: {
    width: '100%',
  },
  genRecoveryPhraseContainer: {
    marginLeft: PADDING_HORIZONTAL,
    marginRight: PADDING_HORIZONTAL,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  genRecoveryPhraseLoadingContainer: {
    padding: 40,
  },
  genRecoveryPhrase: {
    textAlign: 'center',
    color: color.bg.eleventh.color,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '900',
  },
  genRecoveryText: {
    marginBottom: height > SHORT_DEVICE ? 50 : '2%',
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  genRecoveryMessage: {
    paddingHorizontal: 20,
    alignSelf: 'center',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: height > SHORT_DEVICE ? 49 : 0,
  },
  genRecoverySecondMessage: {
    paddingHorizontal: 20,
    alignSelf: 'center',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  genRecoverySmallMessage: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 'bold',
    marginBottom: height > SHORT_DEVICE ? 40 : '3%',
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
    marginTop: height > SHORT_DEVICE ? 40 : 20,
    marginBottom: height > SHORT_DEVICE ? 40 : 20,
  },
  exportBackupMainText: {
    paddingHorizontal: 10,
    fontSize: 18,
    lineHeight: 22,
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
    height: height > SHORT_DEVICE ? 63 : 43,
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
    lineHeight: 27,
    fontSize: 22,
    marginBottom: 20,
    width: '100%',
  },
  exportBackupTitle: {
    fontWeight: '600',
    lineHeight: 27,
    fontSize: 22,
    marginBottom: height > SHORT_DEVICE ? 30 : 0,
    marginTop: height > SHORT_DEVICE ? 10 : 0,
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
    marginBottom: height > SHORT_DEVICE ? 30 : 10,
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
    paddingTop: height > SHORT_DEVICE ? 40 : '2%',
  },
  imageIcon: {
    resizeMode: 'contain',
    width: '100%',
    marginBottom: height > SHORT_DEVICE ? 40 : 0,
  },
})

export default styles

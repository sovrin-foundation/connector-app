// @flow

import React, { PureComponent } from 'react'
import { Image, Dimensions } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import type { Store } from '../store/type-store'
import type { ReactNavigation } from '../common/type-common'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
  CustomHeader,
} from '../components'
import CustomActivityIndicator from '../components/custom-activity-indicator/custom-activity-indicator'
import { SHORT_DEVICE } from '../common/styles'
import { genRecoveryPhraseRoute, verifyRecoveryPhraseRoute } from '../common'
import { color } from '../common/styles/constant'
import type {
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState,
  Passphrase,
} from './type-backup'
import { BACKUP_STORE_STATUS } from './type-backup'
import { generateRecoveryPhrase } from './backup-store'
import {
  RECOVERY_PHRASE_CLOSE_TEST_ID,
  SUBMIT_RECOVERY_PHRASE_TEST_ID,
  SUBMIT_RECOVERY_PHRASE_BUTTON_TITLE,
} from './backup-constants'
import styles from './styles'
import { getBackupPassphrase, getBackupStatus } from '../store/store-selector'
import { PASSPHRASE_GENERATION_ERROR } from '../common'

const { height } = Dimensions.get('window')
const closeImage = require('../images/iconClose.png')
const transparentBands = require('../images/transparentBands.png')
const textBubble = require('../images/textBubble.png')

const PassphraseLoader = (
  <CustomView style={[styles.genRecoveryPhraseContainer]}>
    <CustomView style={[styles.genRecoveryPhraseLoadingContainer]}>
      <CustomActivityIndicator />
    </CustomView>
  </CustomView>
)

const PassphraseError = (
  <CustomView style={[styles.genRecoveryPhraseContainer]}>
    <CustomText transparentBg darkgray center>
      {PASSPHRASE_GENERATION_ERROR}
    </CustomText>
  </CustomView>
)

const PassphraseText = (recoveryPassphrase: Passphrase) => {
  return (
    <CustomView style={[styles.genRecoveryPhraseContainer]}>
      <CustomText transparentBg style={[styles.genRecoveryPhrase]}>
        {recoveryPassphrase.phrase}
      </CustomText>
    </CustomView>
  )
}

export class GenerateRecoveryPhrase extends PureComponent<
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState
> {
  componentDidMount() {
    this.props.generateRecoveryPhrase()
  }

  verifyRecoveryPhrase = () => {
    const { navigation: { navigate, state } } = this.props

    navigate(verifyRecoveryPhraseRoute, {
      recoveryPassphrase: this.props.recoveryPassphrase.hash,
      initialRoute: state.params.initialRoute,
    })
  }

  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomHeader
        flatHeader
        largeHeader
        backgroundColor={color.bg.eleventh.color}
      >
        <CustomView />

        <CustomView style={[styles.genRecoveryHeader]}>
          <Icon
            medium
            onPress={() => navigation.goBack(null)}
            testID={RECOVERY_PHRASE_CLOSE_TEST_ID}
            iconStyle={[styles.headerCloseIcon]}
            src={closeImage}
          />
        </CustomView>
      </CustomHeader>
    ),
    gesturesEnabled: false,
  })
  ImageContents = (recoveryStatus: string, recoveryPassphrase: Passphrase) => {
    if (recoveryStatus === BACKUP_STORE_STATUS.GENERATE_PHRASE_LOADING) {
      return PassphraseLoader
    }

    if (
      recoveryStatus === BACKUP_STORE_STATUS.GENERATE_PHRASE_FAILURE ||
      recoveryStatus === BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_FAILURE
    ) {
      // This block is where we need to try handling passphrase generation differently
      return PassphraseError
    }

    return <PassphraseText {...recoveryPassphrase} />
  }

  render() {
    const { recoveryPassphrase, recoveryStatus } = this.props
    const disableButton =
      recoveryStatus === BACKUP_STORE_STATUS.GENERATE_PHRASE_FAILURE ||
      recoveryStatus === BACKUP_STORE_STATUS.GENERATE_PHRASE_LOADING ||
      recoveryStatus === BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_FAILURE

    return (
      <Container style={[styles.genRecovery]} safeArea>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <Container>
          <CustomView>
            <CustomText
              transparentBg
              numberOfLines={1}
              style={[styles.genRecoveryText]}
            >
              Recovery Phrase Generated
            </CustomText>
          </CustomView>
          <CustomView center>
            <CustomText
              center
              transparentBg
              style={[styles.genRecoveryMessage]}
            >
              This is your recovery phrase. Write it down, and don't share it
              with anyone.
            </CustomText>
          </CustomView>
          <CustomView center>
            <Image source={textBubble} style={[styles.imageIcon]} />
            {this.ImageContents(recoveryStatus, recoveryPassphrase)}
          </CustomView>
          <CustomView center>
            <CustomText
              center
              transparentBg
              style={[styles.genRecoverySecondMessage]}
            >
              You will need this recovery phrase to restore from a backup. Keep
              it safe.
            </CustomText>
          </CustomView>
        </Container>
        <CustomView>
          <CustomView center>
            <CustomText
              transparentBg
              center
              style={[styles.genRecoverySmallMessage]}
            >
              Are you sure you wrote it down?
            </CustomText>
          </CustomView>
          <CustomButton
            disabled={disableButton}
            large={height > SHORT_DEVICE ? true : false}
            onPress={this.verifyRecoveryPhrase}
            testID={SUBMIT_RECOVERY_PHRASE_TEST_ID}
            style={[styles.submitButton]}
            customColor={{
              color: color.bg.eleventh.color,
              fontWeight: '600',
              fontSize: 18,
            }}
            title={SUBMIT_RECOVERY_PHRASE_BUTTON_TITLE}
          />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => {
  return {
    recoveryPassphrase: getBackupPassphrase(state),
    recoveryStatus: getBackupStatus(state),
  }
}
const mapDispatchToProps = dispatch =>
  bindActionCreators({ generateRecoveryPhrase }, dispatch)

export default createStackNavigator({
  [genRecoveryPhraseRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(
      GenerateRecoveryPhrase
    ),
  },
})

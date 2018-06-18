// @flow

import React, { PureComponent } from 'react'
import { Image, Dimensions } from 'react-native'
import { StackNavigator } from 'react-navigation'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
} from '../components'
import { SHORT_DEVICE } from '../common/styles'
import { genRecoveryPhraseRoute, verifyRecoveryPhraseRoute } from '../common'
import { color } from '../common/styles/constant'
import type {
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState,
} from './type-backup'
import {
  RECOVERY_PHRASE_CLOSE_TEST_ID,
  SHOW_RECOVERY_PHRASE_TEST_ID,
  SUBMIT_RECOVERY_PHRASE_TEST_ID,
} from './backup-constants'
import styles from './styles'

const { height } = Dimensions.get('window')
const closeImage = require('../images/iconClose.png')
const transparentBands = require('../images/transparentBands.png')

export class GenerateRecoveryPhrase extends PureComponent<
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState
> {
  state = {
    submitButtonText: 'Continue',
    recoveryPassphrase:
      'The quick brown fox jumped over the fence last Saturday evening.',
  }

  doNothing = () => {}

  verifyRecoveryPhrase = () => {
    const { navigation: { navigate, state } } = this.props
    navigate(verifyRecoveryPhraseRoute, {
      recoveryPassphrase: this.state.recoveryPassphrase,
    })
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <CustomView style={[styles.genRecoveryHeader]}>
        <Icon
          medium
          onPress={() => navigation.goBack(null)}
          testID={RECOVERY_PHRASE_CLOSE_TEST_ID}
          iconStyle={[styles.headerCloseIcon]}
          src={closeImage}
        />
        <CustomText
          transparentBg
          numberOfLines={1}
          demiBold
          style={[styles.genRecoveryText]}
        >
          Recovery Phrase Generated
        </CustomText>
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: color.bg.eleventh.color,
      height: 120,
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    },
    gesturesEnabled: true,
  })

  render() {
    return (
      <Container style={[styles.genRecovery]}>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <CustomView center style={[{ height: 100 }]}>
          <CustomText
            center
            demiBold
            transparentBg
            style={[styles.genRecoveryMessage]}
          >
            This is your recovery phrase. Write it down, and don't share it with
            anyone.
          </CustomText>
        </CustomView>

        <CustomButton
          onPress={this.doNothing}
          testID={SHOW_RECOVERY_PHRASE_TEST_ID}
          style={[styles.showRecoveryPassphrase]}
          customColor={{
            color: color.bg.eleventh.color,
            fontWeight: '600',
            fontSize: 20,
          }}
          title={this.state.recoveryPassphrase}
        />
        <CustomView center>
          <CustomText
            center
            demiBold
            transparentBg
            style={[styles.genRecoveryMessage]}
          >
            You will need this recovery phrase to restore from a backup. Keep it
            safe.
          </CustomText>
        </CustomView>
        <CustomView center>
          <CustomText
            transparentBg
            semiBold
            center
            style={[styles.genRecoverySmallMessage]}
          >
            Are you sure you wrote it down?
          </CustomText>
        </CustomView>

        <CustomButton
          large={height > SHORT_DEVICE ? true : false}
          onPress={this.verifyRecoveryPhrase}
          testID={SUBMIT_RECOVERY_PHRASE_TEST_ID}
          style={[styles.submitButton]}
          customColor={{
            color: color.bg.eleventh.color,
            fontWeight: '600',
            fontSize: 18,
          }}
          title={this.state.submitButtonText}
        />
      </Container>
    )
  }
}

export default StackNavigator({
  [genRecoveryPhraseRoute]: {
    screen: GenerateRecoveryPhrase,
  },
})

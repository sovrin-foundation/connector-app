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
  SUBMIT_RECOVERY_PHRASE_TEST_ID,
  SUBMIT_RECOVERY_PHRASE_BUTTON_TITLE,
} from './backup-constants'
import styles from './styles'

const { height } = Dimensions.get('window')
const closeImage = require('../images/iconClose.png')
const transparentBands = require('../images/transparentBands.png')
const textBubble = require('../images/textBubble.png')

export class GenerateRecoveryPhrase extends PureComponent<
  GenerateRecoveryPhraseProps,
  GenerateRecoveryPhraseState
> {
  state = {
    recoveryPassphrase: 'one two three',
  }

  verifyRecoveryPhrase = () => {
    const { navigation: { navigate, state } } = this.props
    navigate(verifyRecoveryPhraseRoute, {
      recoveryPassphrase: this.state.recoveryPassphrase,
      initialRoute: state.params.initialRoute,
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
    const { navigation: { state } } = this.props
    return (
      <Container style={[styles.genRecovery]}>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <CustomView center style={[styles.genRecoveryWrapper]}>
          <CustomText center transparentBg style={[styles.genRecoveryMessage]}>
            This is your recovery phrase. Write it down, and don't share it with
            anyone.
          </CustomText>
        </CustomView>
        <Container>
          <Image source={textBubble} />
          <Container style={[styles.genRecoveryPhraseContainer]}>
            <CustomText transparentBg style={[styles.genRecoveryPhrase]}>
              {this.state.recoveryPassphrase}
            </CustomText>
          </Container>
        </Container>
        <CustomView center>
          <CustomText
            center
            transparentBg
            style={[styles.genRecoverySecondMessage]}
          >
            You will need this recovery phrase to restore from a backup. Keep it
            safe.
          </CustomText>
        </CustomView>
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
      </Container>
    )
  }
}

export default StackNavigator({
  [genRecoveryPhraseRoute]: {
    screen: GenerateRecoveryPhrase,
  },
})

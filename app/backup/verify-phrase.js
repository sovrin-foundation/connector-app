// @flow

import React, { Component } from 'react'
import { Dimensions, TextInput, Image, Keyboard } from 'react-native'
import { StackNavigator } from 'react-navigation'

import {
  Container,
  CustomView,
  CustomButton,
  Icon,
  CustomText,
} from '../components'
import { verifyRecoveryPhraseRoute, exportBackupFileRoute } from '../common'
import { SHORT_DEVICE } from '../common/styles'
import { color } from '../common/styles/constant'
import styles from './styles'
import type {
  VerifyRecoveryPhraseProps,
  VerifyRecoveryPhraseState,
} from './type-backup'
import {
  VERIFY_BACK_TEST_ID,
  VERIFY_CLOSE_TEST_ID,
  VERIFY_CONTAINER_TEST_ID,
  VERIFY_BUTTON_TITLE,
  VERIFY_INPUT_PLACEHOLDER,
} from './backup-constants'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { height } = Dimensions.get('window')
const transparentBands = require('../images/transparentBands2.png')
const backImage = require('../images/icon_backArrow_white.png')
const closeImage = require('../images/iconClose.png')

export class VerifyRecoveryPhrase extends Component<
  VerifyRecoveryPhraseProps,
  VerifyRecoveryPhraseState
> {
  state = {
    error: false,
    recoveryPassphrase: '',
  }

  static navigationOptions = ({ navigation: { goBack, navigate, state } }) => ({
    headerLeft: (
      <CustomView style={[styles.headerSpacer]}>
        <Icon
          medium
          onPress={() => goBack(null)}
          testID={VERIFY_BACK_TEST_ID}
          iconStyle={[styles.headerBackIcon]}
          src={backImage}
        />
      </CustomView>
    ),
    headerRight: (
      <CustomView style={[styles.headerSpacer]}>
        <Icon
          medium
          onPress={() => navigate(state.params.initialRoute)}
          testID={VERIFY_CLOSE_TEST_ID}
          iconStyle={[styles.headerIcon]}
          src={closeImage}
        />
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: color.bg.twelfth.color,
      borderBottomWidth: 0,
      elevation: 0,
    },
    gesturesEnabled: true,
  })

  verifyRecoveryPhrase = async () => {
    const {
      recoveryPassphrase,
      initialRoute,
    } = this.props.navigation.state.params

    if (recoveryPassphrase === this.state.recoveryPassphrase) {
      this.props.navigation.navigate(exportBackupFileRoute, {
        initialRoute,
      })
      this.setState({ error: false })
    } else {
      this.setState({ error: true })
    }

    Keyboard.dismiss()
  }
  recoveryPhrase = (input: string) => {
    this.setState({ recoveryPassphrase: input })
  }

  componentWillUnmount = () => {
    this.setState({ error: false })
  }

  render() {
    // TODO: Add error UI when that is designed
    return (
      <Container
        testID={VERIFY_CONTAINER_TEST_ID}
        style={[styles.verifyMainContainer]}
        onPress={Keyboard.dismiss}
        safeArea
      >
        <Image
          source={transparentBands}
          style={[styles.backgroundImageVerify]}
        />
        <KeyboardAwareScrollView extraHeight={50}>
          <Container>
            <CustomView center>
              <CustomText transparentBg center style={[styles.title]}>
                Verify Your Recovery Phrase
              </CustomText>
            </CustomView>
            <CustomView center>
              <CustomText
                center
                transparentBg
                h5
                style={[styles.verifyMainText]}
              >
                To verify that you have copied down your recovery phrase
                correctly, please enter it below.
              </CustomText>
            </CustomView>
            <TextInput
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={this.verifyRecoveryPhrase}
              onChangeText={this.recoveryPhrase}
              style={[styles.inputBox]}
              placeholder={VERIFY_INPUT_PLACEHOLDER}
              placeholderTextColor="white"
              autoCorrect={false}
              underlineColorAndroid="transparent"
            />
          </Container>
        </KeyboardAwareScrollView>
      </Container>
    )
  }
}

export default StackNavigator({
  [verifyRecoveryPhraseRoute]: {
    screen: VerifyRecoveryPhrase,
  },
})

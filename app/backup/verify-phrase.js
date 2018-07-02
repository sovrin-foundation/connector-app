// @flow

import React, { Component } from 'react'
import { Dimensions, Keyboard } from 'react-native'
import { StackNavigator } from 'react-navigation'

import { CustomView, Icon } from '../components'
import { verifyRecoveryPhraseRoute, exportBackupFileRoute } from '../common'
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
  VERIFY_INPUT_PLACEHOLDER,
} from './backup-constants'
import { PASSPHRASE_SALT_STORAGE_KEY } from '../common/secure-storage-constants'
import { getItem } from '../services/secure-storage'
import { pinHash as generateKey } from '../lock/pin-hash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import VerifyPhrase from '../components/backup-restore-passphrase/backup-restore-passphrase'

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
    gesturesEnabled: false,
  })

  verifyRecoveryPhrase = async (event: any) => {
    const {
      recoveryPassphrase,
      initialRoute,
    } = this.props.navigation.state.params

    // IMPORTANT: Because of the way that event.nativeEvent works, the nativeEvent property
    // of event will be null if you invoke event.nativeEvent after the await calls below
    const passphraseFromUser = event.nativeEvent.text.trim()
    //////////////////////////////////////////////////////////////////////////////////////////////

    let passphraseSalt = await getItem(PASSPHRASE_SALT_STORAGE_KEY)
    const hashedPassphrase = await generateKey(
      passphraseFromUser,
      passphraseSalt
    )

    if (recoveryPassphrase === hashedPassphrase) {
      this.props.navigation.navigate(exportBackupFileRoute, {
        initialRoute,
      })
      this.setState({ error: false })
    } else {
      this.setState({ error: true })
    }

    Keyboard.dismiss()
  }

  componentWillUnmount = () => {
    this.setState({ error: false })
  }

  render() {
    // TODO: Add error UI when that is designed
    return (
      <VerifyPhrase
        testID={VERIFY_CONTAINER_TEST_ID}
        placeholder={VERIFY_INPUT_PLACEHOLDER}
        onSubmit={this.verifyRecoveryPhrase}
        errorState={this.state.error}
      />
    )
  }
}

export default StackNavigator({
  [verifyRecoveryPhraseRoute]: {
    screen: VerifyRecoveryPhrase,
  },
})

// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Clipboard } from 'react-native'

import { CustomModal, CustomText, CustomView } from '../components'

const encryptionKeyMessage = 'Click here to Copy Your Wallet Encryption Key'
const copiedMessage = 'Copied !'

type WalletBackupSuccessModalProps = {
  walletEncryptionKey: string,
  onContinue: () => void,
  isVisible: boolean,
}

type WalletBackupSuccessModalState = {
  copyText: string,
}

export default class WalletBackupSuccessModal extends PureComponent<
  WalletBackupSuccessModalProps,
  WalletBackupSuccessModalState
> {
  state = {
    copyText: encryptionKeyMessage,
  }
  copyToClipboard = () => {
    Clipboard.setString(this.props.walletEncryptionKey)
    this.setState({
      copyText: copiedMessage,
    })
    setTimeout(() => {
      this.setState({
        copyText: encryptionKeyMessage,
      })
    }, 2000)
  }

  render() {
    return (
      <CustomModal
        onPress={this.props.onContinue}
        buttonText="Continue"
        testID={'wallet-backup-modal'}
        accessible={true}
        accessibilityLabel={'wallet-backup-modal'}
        isVisible={this.props.isVisible}
      >
        <CustomView
          onPress={this.copyToClipboard}
          testID={'wallet-backup-modal-innerview'}
          accessible={true}
          accessibilityLabel={'wallet-backup-modal-innerview'}
        >
          <CustomView doubleVerticalSpace>
            <CustomText
              h5
              transparentBg
              quaternary
              center
              style={[styles.textPadding]}
            >
              {this.props.walletEncryptionKey}
            </CustomText>
          </CustomView>
          <CustomView verticalSpace>
            <CustomText h7 transparentBg quaternary center>
              {this.state.copyText}
            </CustomText>
          </CustomView>
        </CustomView>
      </CustomModal>
    )
  }
}

const styles = StyleSheet.create({
  textPadding: {
    paddingLeft: 15,
    paddingRight: 15,
  },
})

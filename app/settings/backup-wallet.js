// @flow

import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { walletBackup } from '../wallet/wallet-store'
import type { Store } from '../store/type-store'
import type { BackupWalletProps } from '../wallet/type-wallet'

class BackupWallet extends PureComponent<BackupWalletProps, void> {
  backupWallet = () => {
    this.props.walletBackup()
  }
  render() {
    const { render, backup }: BackupWalletProps = this.props
    return <View>{render(backup.status, this.backupWallet)}</View>
  }
}

const mapStateToProps = ({ wallet }: Store) => ({
  backup: wallet.backup,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ walletBackup }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BackupWallet)

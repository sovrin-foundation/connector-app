// @flow

import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import type { Store } from '../store/type-store'
import type { BackupWalletProps } from '../wallet/type-wallet'
import { genRecoveryPhraseRoute } from '../common'

class BackupWallet extends PureComponent<BackupWalletProps, void> {
  backupWallet = () => {
    const { navigation: { navigate } } = this.props

    navigate(genRecoveryPhraseRoute)
  }
  render() {
    const { render, backup }: BackupWalletProps = this.props
    return <View>{render(backup.status, this.backupWallet.bind(this))}</View>
  }
}

const mapStateToProps = ({ wallet }: Store) => ({
  backup: wallet.backup,
})

export default connect(mapStateToProps)(BackupWallet)

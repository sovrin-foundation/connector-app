// @flow

import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash.get'
import type { Store } from '../store/type-store'
import type { BackupWalletProps } from '../wallet/type-wallet'
import { genRecoveryPhraseRoute, settingsRoute } from '../common'

class BackupWallet extends PureComponent<BackupWalletProps, void> {
  backupWallet = () => {
    const { navigation: { navigate, state, goBack } } = this.props
    // If no there is no route, then default to Settings
    const initialRoute = get(state, 'routeName', settingsRoute)
    navigate(genRecoveryPhraseRoute, {
      initialRoute,
    })
  }
  render() {
    const { render, backup }: BackupWalletProps = this.props
    return <View>{render(backup.status, this.backupWallet.bind(this))}</View>
  }
}

const mapStateToProps = ({ wallet }: Store) => ({
  backup: wallet.backup,
})

export default connect(mapStateToProps, null)(BackupWallet)

// @flow

import React, { PureComponent } from 'react'
import { View, Share } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'

import type { BackupWalletProps } from './type-settings'
import { getZippedWalletBackupPath } from '../bridge/react-native-cxs/RNCxs'

export default class BackupWallet extends PureComponent<
  BackupWalletProps,
  void
> {
  static defaultProps = {
    status: '',
  }
  backupWallet = async () => {
    // DUMMY DATA UNTIL MOVED INTO SAGA
    const agencyConfig = {
      agencyUrl: 'something',
      agencyDID: 'something',
      agencyVerificationKey: 'something',
      poolConfig: 'something',
    }
    const documentDirectory = RNFetchBlob.fs.dirs.DocumentDir
    const backup = await getZippedWalletBackupPath(
      documentDirectory,
      agencyConfig
    )

    // TODO: move to backupWalletSaga & figure out flow type check hack for url
    //   Share.share(
    //     {
    //       url: backup,
    //       title: 'Share Your Data Wallet',
    //     },
    //     {
    //       // Android
    //       dialogTitle: 'Share Your Data Wallet',
    //     }
    //   )
    console.log(backup)
  }

  render() {
    const { render, status }: BackupWalletProps = this.props

    return <View>{render(status, this.backupWallet)}</View>
  }
}

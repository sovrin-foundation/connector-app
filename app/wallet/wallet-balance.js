// @flow

import React, { PureComponent } from 'react'
import { View, Image } from 'react-native'
import styles from './styles'
import type { WalletBalanceProps } from './type-wallet'

export default class WalletBalance extends PureComponent<
  WalletBalanceProps,
  void
> {
  static defaultProps = {
    balance: 12470,
  }

  formatBalance = (balance: number) => {
    // TODO: TC Adjust font size or format them via M (million), B(billion), etc. for long numbers.
    return balance.toLocaleString('en-US')
  }

  render() {
    const { balance, render }: WalletBalanceProps = this.props
    return <View>{render(this.formatBalance(balance))}</View>
  }
}

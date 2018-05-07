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
    balance: '12470',
  }

  render() {
    const { balance, render }: WalletBalanceProps = this.props
    return <View>{render(balance)}</View>
  }
}

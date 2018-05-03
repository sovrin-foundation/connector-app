// @flow
import type { ReactNavigation } from '../common/type-common'

export type WalletBalanceProps = {
  balance: number,
  render: Function,
}

export type WalletSendAmountState = {
  text: string,
}

export type WalletSendAmountProps = {}

export type WalletProps = {} & ReactNavigation

export type WalletTabReceiveProps = {
  walletAddresses: string[],
}

// @flow
import type { ReactNavigation } from '../common/type-common'

export type WalletBalanceProps = {
  balance: number,
  render: function,
}

export type WalletProps = {} & ReactNavigation

export type WalletTabReceiveProps = {
  walletAddresses: string[],
}

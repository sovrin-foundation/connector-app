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

export type WalletHistoryProps = {
  walletHistory: Array<WalletHistoryItem>,
}

export type WalletHistoryItem = {
  id: string,
  senderName?: string,
  senderAddress: string,
  action: string,
  tokenAmount: number,
  timestamp: string,
}

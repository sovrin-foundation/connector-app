// @flow
import type { ReactNavigation } from '../common/type-common'
import type { IsValid } from '../components/input-control/type-input-control'

export type WalletBalanceProps = {
  balance: string,
  render: Function,
}

export type WalletSendAmountState = {
  text: string,
}

export type WalletSendAmountProps = {
  screenProps: ReactNavigation,
} & ReactNavigation

export type WalletProps = {} & ReactNavigation

export type WalletTabReceiveProps = {
  walletAddresses: string[],
}

export type WalletTabReceiveState = {
  copyButtonText: string,
}

export type WalletSendPaymentData = {
  paymentTo: string,
  paymentFor?: string,
}

export type WalletTabSendDetailsProps = {
  tokenAmount: string,
} & ReactNavigation

export type WalletTabSendDetailsState = {
  showPaymentAddress: boolean,
  isPaymentAddressValid: IsValid,
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

export type WalletTabsProps = {} & ReactNavigation

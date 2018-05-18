// @flow
import type { ReactNavigation } from '../common/type-common'
import type { CustomError } from '../common/type-common'
import type { IsValid } from '../components/input-control/type-input-control'

export type BackupWalletProps = {
  backup: BackupInfo,
  render: (backup: string, backupWallet: () => void) => void,
  walletBackup: () => void,
}

export type BackupInfo = {
  latest: ?string,
  error: ?CustomError,
} & StoreStatus

export const BACKUP_WALLET = 'BACKUP_WALLET'

export const BACKUP_WALLET_FAIL = 'BACKUP_WALLET_FAIL'

export const BACKUP_WALLET_SUCCESS = 'BACKUP_WALLET_SUCCESS'

export const ERROR_BACKUP_WALLET = {
  code: 'WB-001',
  message: 'Error while backing up wallet',
}

export const ERROR_BACKUP_WALLET_SHARE = {
  code: 'WB-002',
  message: 'Error while sharing zipped backup',
}

export type BackupWalletAction = {
  type: typeof BACKUP_WALLET,
  data: BackupInfo,
}

export type WalletBalanceProps = {
  walletBalance: WalletBalance,
  refreshWalletBalance: () => {},
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
  walletAddresses: Array<string>,
  refreshWalletAddresses: () => {},
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
  walletHistory: WalletHistory,
  refreshWalletHistory: () => {},
}

export type WalletTabsProps = {} & ReactNavigation

export type WalletHistoryEvent = {
  id: string,
  senderName?: string,
  senderAddress: string,
  action: string,
  tokenAmount: number,
  timeStamp: string,
}

export type WalletBalance = {
  data: number,
} & StoreStatus &
  StoreError

export type WalletAddresses = {
  data: Array<string>,
} & StoreStatus &
  StoreError

export type WalletHistory = {
  transactions: WalletHistoryEvent[],
} & StoreStatus &
  StoreError

export const ERROR_LOADING_WALLET = {
  code: 'W001',
  message: 'Error while loading wallet data',
}

export const ERROR_REFRESHING_WALLET_BALANCE = {
  code: 'W002',
  message: 'Error while refreshing wallet balance',
}

export const ERROR_REFRESHING_WALLET_ADDRESSES = {
  code: 'W003',
  message: 'Error while refreshing wallet addresses',
}

export const ERROR_REFRESHING_WALLET_HISTORY = {
  code: 'W004',
  message: 'Error while refreshing wallet history',
}

export const ERROR_LOADING_WALLET_BALANCE = {
  code: 'W005',
  message: 'Error while loading wallet balance',
}

export const ERROR_LOADING_WALLET_ADDRESSES = {
  code: 'W006',
  message: 'Error while loading wallet addresses',
}

export const ERROR_LOADING_WALLET_HISTORY = {
  code: 'W007',
  message: 'Error while loading wallet history',
}

export const STORE_STATUS = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
}

export type StoreError = { error: ?CustomError }
export type StoreStatus = { status: $Keys<typeof STORE_STATUS> }

export type WalletStore = {
  walletBalance: WalletBalance,
  walletAddresses: WalletAddresses,
  walletHistory: WalletHistory,
  backup: BackupInfo,
}

export type HydrateWalletStoreFailAction = {
  type: typeof HYDRATE_WALLET_STORE_FAIL,
  error: CustomError,
}

export type HydrateWalletBalanceFailAction = {
  type: typeof HYDRATE_WALLET_BALANCE_FAIL,
  error: CustomError,
  status: StoreStatus,
}

export type HydrateWalletAddressesFailAction = {
  type: typeof HYDRATE_WALLET_ADDRESSES_FAIL,
  error: CustomError,
  status: StoreStatus,
}

export type HydrateWalletHistoryFailAction = {
  type: typeof HYDRATE_WALLET_HISTORY_FAIL,
  error: CustomError,
  status: StoreStatus,
}

export type RefreshWalletStoreFailAction = {
  type: typeof REFRESH_WALLET_STORE_FAIL,
  error: CustomError,
}

export const HYDRATE_WALLET_STORE_FAIL = 'HYDRATE_WALLET_STORE_FAIL'
export const HYDRATE_WALLET_BALANCE_FAIL = 'HYDRATE_WALLET_BALANCE_FAIL'
export const HYDRATE_WALLET_ADDRESSES_FAIL = 'HYDRATE_WALLET_ADDRESSES_FAIL'
export const HYDRATE_WALLET_HISTORY_FAIL = 'HYDRATE_WALLET_HISTORY_FAIL'
export const REFRESH_WALLET_STORE_FAIL = 'REFRESH_WALLET_STORE_FAIL'
export const REFRESH_WALLET_BALANCE_FAIL = 'REFRESH_WALLET_BALANCE_FAIL'
export const REFRESH_WALLET_ADDRESSES_FAIL = 'REFRESH_WALLET_ADDRESSES_FAIL'
export const REFRESH_WALLET_HISTORY_FAIL = 'REFRESH_WALLET_HISTORY_FAIL'
export const HYDRATE_WALLET_STORE = 'HYDRATE_WALLET_STORE'
export const HYDRATE_WALLET_BALANCE = 'HYDRATE_WALLET_BALANCE'
export const HYDRATE_WALLET_ADDRESSES = 'HYDRATE_WALLET_ADDRESSES'
export const HYDRATE_WALLET_HISTORY = 'HYDRATE_WALLET_HISTORY'
export const REFRESH_WALLET = 'REFRESH_WALLET'
export const REFRESH_WALLET_ADDRESSES = 'REFRESH_WALLET_ADDRESSES'
export const REFRESH_WALLET_HISTORY = 'REFRESH_WALLET_HISTORY'
export const REFRESH_WALLET_BALANCE = 'REFRESH_WALLET_BALANCE'
export const WALLET_BALANCE_REFRESHED = 'WALLET_BALANCE_REFRESHED'
export const WALLET_ADDRESSES_REFRESHED = 'WALLET_ADDRESSES_REFRESHED'
export const WALLET_HISTORY_REFRESHED = 'WALLET_HISTORY_REFRESHED'

export type HydrateWalletBalanceData = number

export type HydrateWalletAddressesData = Array<string>

export type HydrateWalletHistoryTransactions = WalletHistoryEvent[]

export type RefreshWalletHistoryAction = {
  type: typeof REFRESH_WALLET_HISTORY,
}

export type WalletBalanceRefreshedAction = {
  type: typeof WALLET_BALANCE_REFRESHED,
  walletBalance: WalletBalance,
}

export type WalletAddressesRefreshedAction = {
  type: typeof WALLET_ADDRESSES_REFRESHED,
  walletAddresses: WalletAddresses,
}

export type WalletHistoryRefreshedAction = {
  type: typeof WALLET_HISTORY_REFRESHED,
  walletHistory: WalletHistory,
}

export type RefreshWalletAddressesAction = {
  type: typeof REFRESH_WALLET_ADDRESSES,
}

export type RefreshWalletBalanceAction = {
  type: typeof REFRESH_WALLET_BALANCE,
  walletBalance: WalletBalance,
}

export type HydrateWalletBalanceAction = {
  type: typeof HYDRATE_WALLET_BALANCE,
  walletBalance: WalletBalance,
}

export type HydrateWalletAddressesAction = {
  type: typeof HYDRATE_WALLET_ADDRESSES,
  walletAddresses: WalletAddresses,
}

export type HydrateWalletHistoryAction = {
  type: typeof HYDRATE_WALLET_HISTORY,
  walletHistory: WalletHistory,
}

export type WalletStoreAction =
  | HydrateWalletStoreFailAction
  | HydrateWalletBalanceFailAction
  | HydrateWalletAddressesFailAction
  | HydrateWalletHistoryFailAction
  | RefreshWalletBalanceAction
  | RefreshWalletAddressesAction
  | RefreshWalletHistoryAction
  | WalletHistoryRefreshedAction
  | WalletBalanceRefreshedAction
  | WalletAddressesRefreshedAction
  | HydrateWalletBalanceAction
  | HydrateWalletAddressesAction
  | HydrateWalletHistoryAction
  | BackupWalletAction

// TODO: add BackupWalletAction types for action of success and failure

// @flow
import type { ReactNavigation } from '../common/type-common'
import type { CustomError } from '../common/type-common'
import type { IsValid } from '../components/input-control/type-input-control'

export type BackupWalletProps = {
  backup: BackupInfo,
  render: (backup: string, backupWallet: () => void) => void,
  walletBackup: () => void,
} & ReactNavigation

export type BackupInfo = {
  latest: ?string,
  error: ?CustomError,
  backupPath: ?string,
} & StoreStatus

export const BACKUP_WALLET = 'BACKUP_WALLET'

export const BACKUP_WALLET_FAIL = 'BACKUP_WALLET_FAIL'

export const BACKUP_WALLET_SUCCESS = 'BACKUP_WALLET_SUCCESS'

export const GET_WALLET_ENCRYPTION_KEY = 'GET_WALLET_ENCRYPTION_KEY'

export const BACKUP_WALLET_PATH = 'BACKUP_WALLET_PATH'

export const SHARE_WALLET_BACKUP = 'SHARE_WALLET_BACKUP'

export const ERROR_BACKUP_WALLET = {
  code: 'WB-001',
  message: 'Error while backing up wallet',
}

export const ERROR_BACKUP_WALLET_SHARE = {
  code: 'WB-002',
  message: 'Error while sharing zipped backup',
}

export type WalletTabSendDetailsProps = {
  tokenAmount: string,
  tokenSentStatus: $Keys<typeof STORE_STATUS>,
  sendTokens: (
    tokenAmount: string,
    recipientAddress: string
  ) => SendTokensAction,
} & ReactNavigation

export type BackupWalletAction = {
  type: typeof BACKUP_WALLET,
  data: BackupInfo,
}

export type ShareBackupAction = {
  type: typeof SHARE_WALLET_BACKUP,
  data: BackupInfo,
}

export type WalletBalanceProps = {
  walletBalance: string,
  refreshWalletBalance: () => {},
  render: Function,
}

export type WalletSendAmountState = {
  text: string,
}

export type WalletSendAmountProps = {
  screenProps: ReactNavigation,
  selectTokenAmount: (tokenAmount: string) => {},
  walletBalance: string,
  paymentStatus: $Keys<typeof STORE_STATUS>,
} & ReactNavigation

export type WalletProps = {} & ReactNavigation

export type WalletPayload = {
  walletPath: string,
  encryptionKey: string,
}

export type WalletTabReceiveProps = {
  walletAddresses: Array<string>,
  refreshWalletAddresses: () => {},
  promptBackupBanner: (showBackup: boolean) => {},
  addressStatus: $Keys<typeof STORE_STATUS>,
}

export type WalletTabReceiveState = {
  copyButtonText: string,
}

export type WalletSendPaymentData = {
  paymentTo: string,
  paymentFor?: string,
}

export type WalletTabSendDetailsState = {
  showPaymentAddress: boolean,
  isPaymentAddressValid: IsValid,
  tokenSentFailedVisible: boolean,
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
  tokenAmount: string,
  timeStamp: string,
}

export type WalletBalance = {
  data: string,
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

export type Payment = {
  tokenAmount: string,
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

export const ERROR_SENDING_TOKENS = {
  code: 'W008',
  message: 'Error sending tokens',
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
  payment: Payment,
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

export type SendTokensAction = {
  type: typeof SEND_TOKENS,
  tokenAmount: string,
  recipientWalletAddress: string,
}

export type SelectTokensAction = {
  type: typeof SEND_TOKENS,
  tokenAmount: string,
}

export const HYDRATE_WALLET_BALANCE_FAIL = 'HYDRATE_WALLET_BALANCE_FAIL'
export const HYDRATE_WALLET_ADDRESSES_FAIL = 'HYDRATE_WALLET_ADDRESSES_FAIL'
export const HYDRATE_WALLET_HISTORY_FAIL = 'HYDRATE_WALLET_HISTORY_FAIL'
export const REFRESH_WALLET_BALANCE_FAIL = 'REFRESH_WALLET_BALANCE_FAIL'
export const REFRESH_WALLET_ADDRESSES_FAIL = 'REFRESH_WALLET_ADDRESSES_FAIL'
export const REFRESH_WALLET_HISTORY_FAIL = 'REFRESH_WALLET_HISTORY_FAIL'
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
export const SEND_TOKENS = 'SEND_TOKENS'
export const SEND_TOKENS_FAIL = 'SEND_TOKENS_FAIL'
export const TOKEN_SENT_SUCCESS = 'TOKEN_SENT_SUCCESS'
export const SELECT_TOKEN_AMOUNT = 'SELECT_TOKEN_AMOUNT'
export const PROMPT_WALLET_BACKUP_BANNER = 'PROMPT_WALLET_BACKUP_BANNER'
export const WALLET_ADDRESSES_FETCH_START = 'WALLET_ADDRESSES_FETCH_START'

export type PromptBackupBannerAction = {
  type: typeof PROMPT_WALLET_BACKUP_BANNER,
  showBanner: boolean,
}

export type HydrateWalletBalanceData = string

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

export type TokenSentSuccessAction = {
  type: typeof TOKEN_SENT_SUCCESS,
  payment: Payment,
}

export type WalletStoreAction =
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
  | SendTokensAction
  | TokenSentSuccessAction
  | SelectTokensAction

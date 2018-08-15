// @flow

import {
  put,
  takeLatest,
  call,
  all,
  select,
  takeEvery,
} from 'redux-saga/effects'
import RNFetchBlob from 'react-native-fetch-blob'
import { Platform } from 'react-native'
import Share from 'react-native-share'
import type { Saga } from 'redux-saga'
import moment from 'moment'
import {
  secureSet,
  secureGet,
  secureDelete,
  safeSet,
} from '../services/storage'
import {
  HYDRATE_WALLET_BALANCE_FAIL,
  HYDRATE_WALLET_ADDRESSES_FAIL,
  HYDRATE_WALLET_HISTORY_FAIL,
  REFRESH_WALLET_ADDRESSES,
  REFRESH_WALLET_HISTORY,
  PROMPT_WALLET_BACKUP_BANNER,
  REFRESH_WALLET_BALANCE_FAIL,
  REFRESH_WALLET_ADDRESSES_FAIL,
  REFRESH_WALLET_HISTORY_FAIL,
  ERROR_REFRESHING_WALLET_BALANCE,
  REFRESH_WALLET_BALANCE,
  WALLET_BALANCE_REFRESHED,
  WALLET_ADDRESSES_REFRESHED,
  WALLET_HISTORY_REFRESHED,
  ERROR_REFRESHING_WALLET_ADDRESSES,
  ERROR_REFRESHING_WALLET_HISTORY,
  HYDRATE_WALLET_BALANCE,
  HYDRATE_WALLET_ADDRESSES,
  HYDRATE_WALLET_HISTORY,
  ERROR_LOADING_WALLET_BALANCE,
  ERROR_LOADING_WALLET_ADDRESSES,
  ERROR_LOADING_WALLET_HISTORY,
  STORE_STATUS,
  BACKUP_WALLET,
  BACKUP_WALLET_FAIL,
  BACKUP_WALLET_SUCCESS,
  BACKUP_WALLET_PATH,
  SHARE_WALLET_BACKUP,
  GET_WALLET_ENCRYPTION_KEY,
  ERROR_BACKUP_WALLET,
  ERROR_BACKUP_WALLET_SHARE,
  SEND_TOKENS,
  SEND_TOKENS_FAIL,
  ERROR_SENDING_TOKENS,
  TOKEN_SENT_SUCCESS,
  SELECT_TOKEN_AMOUNT,
  WALLET_ADDRESSES_FETCH_START,
} from './type-wallet'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import type { AgencyPoolConfig } from '../store/type-config-store'
import type {
  WalletStore,
  WalletStoreAction,
  HydrateWalletBalanceData,
  HydrateWalletAddressesData,
  HydrateWalletHistoryTransactions,
  RefreshWalletHistoryAction,
  RefreshWalletAddressesAction,
  RefreshWalletBalanceAction,
  BackupWalletAction,
  WalletHistory,
  WalletBalance,
  WalletAddresses,
  SendTokensAction,
  ShareBackupAction,
  PromptBackupBannerAction,
} from './type-wallet'
import type { CustomError } from '../common/type-common'
import { RESET } from '../common/type-common'
import {
  WALLET_BALANCE,
  WALLET_ADDRESSES,
  WALLET_HISTORY,
} from '../common/secure-storage-constants'
import {
  getWalletBalance,
  getWalletAddresses,
  getWalletHistory,
  sendTokenAmount,
  createPaymentAddress,
} from '../bridge/react-native-cxs/RNCxs'
import { promptBackupBanner } from '../backup/backup-store'
import { getConfig } from '../store/store-selector'
import { WALLET_ENCRYPTION_KEY } from '../common/secure-storage-constants'
import { ensureVcxInitSuccess } from '../store/config-store'

export const walletInitialState = {
  walletBalance: { data: '0', status: STORE_STATUS.IDLE, error: null },
  walletAddresses: { data: [], status: STORE_STATUS.IDLE, error: null },
  walletHistory: { transactions: [], status: STORE_STATUS.IDLE, error: null },
  backup: {
    status: STORE_STATUS.IDLE,
    latest: null,
    error: null,
    backupPath: null,
  },
  payment: { tokenAmount: '0', status: STORE_STATUS.IDLE, error: null },
}

export function* shareBackupSaga(
  action: ShareBackupAction
): Generator<*, *, *> {
  // SHARE BACKUP FLOW
  const { data } = action
  const { backupPath }: { backupPath: any } = data

  try {
    Platform.OS === 'android'
      ? yield call(Share.open, {
          title: 'Share Your Data Wallet',
          url: `file://${backupPath}`,
          type: 'application/zip',
        })
      : yield call(Share.open, {
          title: 'Share Your Data Wallet',
          url: backupPath,
          type: 'application/zip',
          message: 'here we go!',
          subject: 'something here maybe?',
        })
    yield put(walletBackupComplete(backupPath))
    yield put(promptBackupBanner(false))
    let encryptionKey = yield call(secureGet, WALLET_ENCRYPTION_KEY)
    // TODO: has to be removed, only for android testing and the above let has to be changed to const
    if (encryptionKey === null) {
      encryptionKey = WALLET_ENCRYPTION_KEY
    }
    yield put(walletEncryptionKey(encryptionKey))
  } catch (e) {
    yield put(
      backupWalletFail({
        ...ERROR_BACKUP_WALLET_SHARE,
        message: `${ERROR_BACKUP_WALLET_SHARE.message}.${e}`,
      })
    )
  }
}

export const backupWalletFail = (error: CustomError) => ({
  type: BACKUP_WALLET_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const backupWalletPath = (backupPath: string) => ({
  type: BACKUP_WALLET_PATH,
  backupPath,
})

export const walletEncryptionKey = (WALLET_ENCRYPTION_KEY: string) => ({
  type: GET_WALLET_ENCRYPTION_KEY,
  data: {
    encryptionKey: WALLET_ENCRYPTION_KEY,
    status: STORE_STATUS.SUCCESS,
  },
})

export const walletBackup = () => ({
  type: BACKUP_WALLET,
  data: {
    status: STORE_STATUS.IN_PROGRESS,
    error: null,
  },
})

export const walletBackupShare = (WALLET_BACKUP_PATH: string) => ({
  type: SHARE_WALLET_BACKUP,
  data: {
    status: STORE_STATUS.IN_PROGRESS,
    backupPath: WALLET_BACKUP_PATH,
    error: null,
  },
})

export const walletBackupComplete = (WALLET_BACKUP_PATH: string) => ({
  type: BACKUP_WALLET_SUCCESS,
  data: {
    status: STORE_STATUS.SUCCESS,
    latest: moment().format(),
    backupPath: WALLET_BACKUP_PATH,
    error: null,
  },
})

export function* hydrateWalletStoreSaga(): Generator<*, *, *> {
  yield all([
    call(hydrateWalletBalanceSaga),
    call(hydrateWalletAddressesSaga),
    call(hydrateWalletHistorySaga),
  ])
}

export function* hydrateWalletBalanceSaga(): Generator<*, *, *> {
  try {
    const walletBalance: string = yield call(secureGet, WALLET_BALANCE)
    if (walletBalance !== null) {
      yield put(hydrateWalletBalanceStore(walletBalance))
    } else {
      yield put(
        hydrateWalletBalanceFail({
          ...ERROR_LOADING_WALLET_BALANCE,
          message: `${ERROR_LOADING_WALLET_BALANCE.message}`,
        })
      )
    }
  } catch (e) {
    yield put(
      hydrateWalletBalanceFail({
        ...ERROR_LOADING_WALLET_BALANCE,
        message: `${ERROR_LOADING_WALLET_BALANCE.message} ${e.message}`,
      })
    )
  }
}

export function* hydrateWalletAddressesSaga(): Generator<*, *, *> {
  try {
    const walletAddressesJson = yield call(secureGet, WALLET_ADDRESSES)
    if (walletAddressesJson !== null) {
      const walletAddresses = JSON.parse(walletAddressesJson)
      yield put(hydrateWalletAddressesStore(walletAddresses))
    } else {
      yield put(
        hydrateWalletAddressesFail({
          ...ERROR_LOADING_WALLET_ADDRESSES,
          message: `${ERROR_LOADING_WALLET_ADDRESSES.message}`,
        })
      )
    }
  } catch (e) {
    yield put(
      hydrateWalletAddressesFail({
        ...ERROR_LOADING_WALLET_ADDRESSES,
        message: `${ERROR_LOADING_WALLET_ADDRESSES.message} ${e.message}`,
      })
    )
  }
}

export function* hydrateWalletHistorySaga(): Generator<*, *, *> {
  try {
    const walletHistoryJson = yield call(secureGet, WALLET_HISTORY)
    if (walletHistoryJson !== null) {
      const walletHistory = JSON.parse(walletHistoryJson)
      yield put(hydrateWalletHistoryStore(walletHistory))
    } else {
      yield put(
        hydrateWalletHistoryFail({
          ...ERROR_LOADING_WALLET_HISTORY,
          message: `${ERROR_LOADING_WALLET_HISTORY.message}`,
        })
      )
    }
  } catch (e) {
    yield put(
      hydrateWalletHistoryFail({
        ...ERROR_LOADING_WALLET_HISTORY,
        message: `${ERROR_LOADING_WALLET_HISTORY.message} ${e.message}`,
      })
    )
  }
}

export function* deletePersistedWalletBalance(): Generator<*, *, *> {
  yield call(secureDelete, WALLET_BALANCE)
}

export function* deletePersistedWalletAddresses(): Generator<*, *, *> {
  yield call(secureDelete, WALLET_ADDRESSES)
}

export function* deletePersistedWalletHistory(): Generator<*, *, *> {
  yield call(secureDelete, WALLET_HISTORY)
}

export function* watchWalletStore(): any {
  yield all([
    watchRefreshWalletBalance(),
    watchRefreshWalletAddresses(),
    watchRefreshWalletHistory(),
    watchSendTokens(),
  ])
}

function* watchRefreshWalletBalance(): any {
  yield takeLatest(REFRESH_WALLET_BALANCE, refreshWalletBalanceSaga)
}

function* watchRefreshWalletAddresses(): any {
  yield takeLatest(REFRESH_WALLET_ADDRESSES, refreshWalletAddressesSaga)
}

function* watchRefreshWalletHistory(): any {
  yield takeLatest(REFRESH_WALLET_HISTORY, refreshWalletHistorySaga)
}

function* watchSendTokens(): any {
  yield takeLatest(SEND_TOKENS, sendTokensSaga)
}

export function* sendTokensSaga(action: SendTokensAction): Saga<void> {
  yield* ensureVcxInitSuccess()
  try {
    yield call(
      sendTokenAmount,
      action.tokenAmount,
      action.recipientWalletAddress
    )
    yield all([
      put(tokenSentSuccess(action.tokenAmount)),
      refreshWalletBalanceSaga(),
      refreshWalletHistorySaga(),
    ])
  } catch (e) {
    yield put(
      sendTokensFail(action.tokenAmount, {
        ...ERROR_SENDING_TOKENS,
        message: `${ERROR_SENDING_TOKENS.message} ${e.message}`,
      })
    )
  }
}

export function* refreshWalletBalanceSaga(): any {
  yield* ensureVcxInitSuccess()
  try {
    const walletBalanceData: string = yield call(getWalletBalance)
    yield put(walletBalanceRefreshed(walletBalanceData))
    yield call(secureSet, WALLET_BALANCE, walletBalanceData)
  } catch (e) {
    yield put(
      refreshWalletBalanceFail({
        ...ERROR_REFRESHING_WALLET_BALANCE,
        message: `${ERROR_REFRESHING_WALLET_BALANCE.message} ${e.message}`,
      })
    )
  }
}

export function* refreshWalletHistorySaga(): any {
  yield* ensureVcxInitSuccess()
  try {
    const walletHistoryData = yield call(getWalletHistory)
    yield put(walletHistoryRefreshed(walletHistoryData))
    yield call(secureSet, WALLET_HISTORY, JSON.stringify(walletHistoryData))
  } catch (e) {
    yield put(
      refreshWalletHistoryFail({
        ...ERROR_REFRESHING_WALLET_HISTORY,
        message: `${ERROR_REFRESHING_WALLET_HISTORY.message} ${e.message}`,
      })
    )
  }
}

export function* refreshWalletAddressesSaga(): Generator<*, *, *> {
  yield put(walletAddressesFetchStart())
  yield* ensureVcxInitSuccess()
  try {
    let walletAddressesData: string[] = yield call(getWalletAddresses)
    if (walletAddressesData.length === 0) {
      // not passing any seed for now
      yield call(createPaymentAddress, null)
      // we could put recursion here as well
      // but we would have to change saga signature so that we can have
      // exit condition for recursion, for now we are just trying once
      // and if we don't get any address even after creating it
      // we won't try again
      walletAddressesData = yield call(getWalletAddresses)
    }
    yield put(walletAddressesRefreshed(walletAddressesData))
    yield call(secureSet, WALLET_ADDRESSES, JSON.stringify(walletAddressesData))
  } catch (e) {
    yield put(
      refreshWalletAddressesFail({
        ...ERROR_REFRESHING_WALLET_ADDRESSES,
        message: `${ERROR_REFRESHING_WALLET_ADDRESSES.message} ${e.message}`,
      })
    )
  }
}

export const walletBalanceRefreshed = (walletBalanceData: string) => ({
  type: WALLET_BALANCE_REFRESHED,
  walletBalance: {
    data: walletBalanceData,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const tokenSentSuccess = (tokenAmount: string) => ({
  type: TOKEN_SENT_SUCCESS,
  payment: {
    tokenAmount,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const selectTokenAmount = (tokenAmount: string) => ({
  type: SELECT_TOKEN_AMOUNT,
  payment: {
    tokenAmount,
    status: STORE_STATUS.IDLE,
    error: null,
  },
})

export const walletAddressesRefreshed = (
  walletAddressesData: Array<string>
) => ({
  type: WALLET_ADDRESSES_REFRESHED,
  walletAddresses: {
    data: walletAddressesData,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const walletAddressesFetchStart = () => ({
  type: WALLET_ADDRESSES_FETCH_START,
})

export const walletHistoryRefreshed = (walletHistoryData: any) => ({
  type: WALLET_HISTORY_REFRESHED,
  walletHistory: {
    transactions: walletHistoryData,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const refreshWalletBalance = () => ({
  type: REFRESH_WALLET_BALANCE,
})

export const refreshWalletAddresses = () => ({
  type: REFRESH_WALLET_ADDRESSES,
})

export const refreshWalletHistory = () => ({
  type: REFRESH_WALLET_HISTORY,
})

export const hydrateWalletBalanceStore = (
  walletBalanceData: HydrateWalletBalanceData
) => ({
  type: HYDRATE_WALLET_BALANCE,
  walletBalance: {
    data: walletBalanceData,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const hydrateWalletAddressesStore = (
  walletAddressesData: HydrateWalletAddressesData
) => ({
  type: HYDRATE_WALLET_ADDRESSES,
  walletAddresses: {
    data: walletAddressesData,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const hydrateWalletHistoryStore = (
  walletHistoryTransactions: HydrateWalletHistoryTransactions
) => ({
  type: HYDRATE_WALLET_HISTORY,
  walletHistory: {
    transactions: walletHistoryTransactions,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
})

export const hydrateWalletBalanceFail = (error: CustomError) => ({
  type: HYDRATE_WALLET_BALANCE_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const hydrateWalletAddressesFail = (error: CustomError) => ({
  type: HYDRATE_WALLET_ADDRESSES_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const hydrateWalletHistoryFail = (error: CustomError) => ({
  type: HYDRATE_WALLET_HISTORY_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const refreshWalletBalanceFail = (error: CustomError) => ({
  type: REFRESH_WALLET_BALANCE_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const sendTokensFail = (tokenAmount: string, error: CustomError) => ({
  type: SEND_TOKENS_FAIL,
  payment: {
    tokenAmount,
    error,
    status: STORE_STATUS.ERROR,
  },
})

export const refreshWalletAddressesFail = (error: CustomError) => ({
  type: REFRESH_WALLET_ADDRESSES_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const refreshWalletHistoryFail = (error: CustomError) => ({
  type: REFRESH_WALLET_HISTORY_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const sendTokens = (
  tokenAmount: string,
  recipientWalletAddress: string
) => ({
  type: SEND_TOKENS,
  tokenAmount,
  recipientWalletAddress,
})

export default function walletReducer(
  state: WalletStore = walletInitialState,
  action: WalletStoreAction
) {
  switch (action.type) {
    case HYDRATE_WALLET_BALANCE: {
      return {
        ...state,
        walletBalance: action.walletBalance,
      }
    }
    case HYDRATE_WALLET_ADDRESSES: {
      return {
        ...state,
        walletAddresses: action.walletAddresses,
      }
    }
    case HYDRATE_WALLET_HISTORY: {
      return {
        ...state,
        walletHistory: action.walletHistory,
      }
    }
    case HYDRATE_WALLET_BALANCE_FAIL: {
      return {
        ...state,
        walletBalance: {
          ...state.walletBalance,
          status: action.status,
          error: action.error,
        },
      }
    }
    case HYDRATE_WALLET_ADDRESSES_FAIL: {
      return {
        ...state,
        walletAddresses: {
          ...state.walletAddresses,
          status: action.status,
          error: action.error,
        },
      }
    }
    case HYDRATE_WALLET_HISTORY_FAIL: {
      return {
        ...state,
        walletHistory: {
          ...state.walletHistory,
          status: action.status,
          error: action.error,
        },
      }
    }
    case WALLET_BALANCE_REFRESHED: {
      const { walletBalance } = action
      return {
        ...state,
        walletBalance,
      }
    }
    case WALLET_ADDRESSES_REFRESHED: {
      const { walletAddresses } = action
      return {
        ...state,
        walletAddresses,
      }
    }

    case WALLET_ADDRESSES_FETCH_START:
      return {
        ...state,
        walletAddresses: {
          ...state.walletAddresses,
          status: STORE_STATUS.IN_PROGRESS,
          error: null,
        },
      }

    case WALLET_HISTORY_REFRESHED: {
      const { walletHistory } = action
      return {
        ...state,
        walletHistory,
      }
    }
    case REFRESH_WALLET_BALANCE_FAIL: {
      return {
        ...state,
        walletBalance: {
          ...state.walletBalance,
          status: action.status,
          error: action.error,
        },
      }
    }
    case REFRESH_WALLET_ADDRESSES_FAIL: {
      return {
        ...state,
        walletAddresses: {
          ...state.walletAddresses,
          status: action.status,
          error: action.error,
        },
      }
    }
    case REFRESH_WALLET_HISTORY_FAIL: {
      return {
        ...state,
        walletHistory: {
          ...state.walletHistory,
          status: action.status,
          error: action.error,
        },
      }
    }
    case BACKUP_WALLET: {
      const { status, error } = action.data
      return {
        ...state,
        backup: {
          ...state.backup,
          status,
          error,
        },
      }
    }
    case BACKUP_WALLET_PATH: {
      const { backupPath } = action
      return {
        ...state,
        backup: {
          ...state.backup,
          backupPath,
        },
      }
    }
    case BACKUP_WALLET_SUCCESS: {
      const { status, error, latest, backupPath } = action.data

      return {
        ...state,
        backup: {
          latest,
          status,
          error,
          backupPath,
        },
      }
    }
    case GET_WALLET_ENCRYPTION_KEY: {
      const { encryptionKey, status } = action.data
      return {
        ...state,
        backup: {
          ...state.backup,
          encryptionKey,
          status,
        },
      }
    }
    case BACKUP_WALLET_FAIL: {
      const { status, error } = action

      return {
        ...state,
        backup: {
          ...state.backup,
          status,
          error,
        },
      }
    }
    case TOKEN_SENT_SUCCESS: {
      const { payment } = action
      return {
        ...state,
        payment,
      }
    }

    case SEND_TOKENS:
      return {
        ...state,
        payment: {
          ...state.payment,
          status: STORE_STATUS.IN_PROGRESS,
        },
      }

    case SEND_TOKENS_FAIL: {
      const { payment } = action
      return {
        ...state,
        payment,
      }
    }
    case SELECT_TOKEN_AMOUNT: {
      const { payment } = action
      return {
        ...state,
        payment,
      }
    }

    case RESET:
      return walletInitialState
    default:
      return state
  }
}

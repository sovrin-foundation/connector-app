// @flow

import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import { AsyncStorage } from 'react-native'
import type { Saga } from 'redux-saga'
import { setItem, getItem, deleteItem } from '../services/secure-storage'
import {
  HYDRATE_WALLET_STORE,
  HYDRATE_WALLET_STORE_FAIL,
  HYDRATE_WALLET_BALANCE_FAIL,
  HYDRATE_WALLET_ADDRESSES_FAIL,
  HYDRATE_WALLET_HISTORY_FAIL,
  REFRESH_WALLET_ADDRESSES,
  REFRESH_WALLET_HISTORY,
  ERROR_LOADING_WALLET,
  REFRESH_WALLET_STORE_FAIL,
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
} from './type-wallet'
import type {
  WalletStore,
  WalletStoreAction,
  HydrateWalletBalanceData,
  HydrateWalletAddressesData,
  HydrateWalletHistoryTransactions,
  RefreshWalletHistoryAction,
  RefreshWalletAddressesAction,
  RefreshWalletBalanceAction,
  WalletHistory,
  WalletBalance,
  WalletAddresses,
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
} from '../bridge/react-native-cxs/RNCxs'

const initialState = {
  walletBalance: { data: 0, status: STORE_STATUS.IDLE, error: null },
  walletAddresses: { data: [], status: STORE_STATUS.IDLE, error: null },
  walletHistory: { transactions: [], status: STORE_STATUS.IDLE, error: null },
}

export function* hydrateWalletStoreSaga(): Generator<*, *, *> {
  yield all([
    call(hydrateWalletBalanceSaga),
    call(hydrateWalletAddressesSaga),
    call(hydrateWalletHistorySaga),
  ])
}

export function* hydrateWalletBalanceSaga(): Generator<*, *, *> {
  try {
    const walletBalanceJson = yield call(getItem, WALLET_BALANCE)
    if (walletBalanceJson !== null) {
      const walletBalance = JSON.parse(walletBalanceJson)
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
    const walletAddressesJson = yield call(getItem, WALLET_ADDRESSES)
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
    const walletHistoryJson = yield call(getItem, WALLET_HISTORY)
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
  yield call(deleteItem, WALLET_BALANCE)
}

export function* deletePersistedWalletAddresses(): Generator<*, *, *> {
  yield call(deleteItem, WALLET_ADDRESSES)
}

export function* deletePersistedWalletHistory(): Generator<*, *, *> {
  yield call(deleteItem, WALLET_HISTORY)
}

//TODO add sagas,action,reducers for payment related stuff

export function* watchWalletStore(): Saga<void> {
  yield all([
    watchRefreshWalletBalance(),
    watchRefreshWalletAddresses(),
    watchRefreshWalletHistory(),
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

export function* refreshWalletBalanceSaga(
  action: RefreshWalletBalanceAction
): Saga<void> {
  const walletBalanceData = yield call(getWalletBalance)
  try {
    yield put(walletBalanceRefreshed(walletBalanceData))
    yield call(setItem, WALLET_BALANCE, JSON.stringify(walletBalanceData))
  } catch (e) {
    yield put(
      refreshWalletBalanceFail({
        ...ERROR_REFRESHING_WALLET_BALANCE,
        message: `${ERROR_REFRESHING_WALLET_BALANCE.message} ${e.message}`,
      })
    )
  }
}

export function* refreshWalletHistorySaga(
  action: RefreshWalletHistoryAction
): Saga<void> {
  try {
    const walletHistoryData = yield call(getWalletHistory)
    yield put(walletHistoryRefreshed(walletHistoryData))
    yield call(setItem, WALLET_HISTORY, JSON.stringify(walletHistoryData))
  } catch (e) {
    yield put(
      refreshWalletHistoryFail({
        ...ERROR_REFRESHING_WALLET_HISTORY,
        message: `${ERROR_REFRESHING_WALLET_HISTORY.message} ${e.message}`,
      })
    )
  }
}

export function* refreshWalletAddressesSaga(
  action: RefreshWalletAddressesAction
): Saga<void> {
  try {
    const walletAddressesData = yield call(getWalletAddresses)
    yield put(walletAddressesRefreshed(walletAddressesData))
    yield call(setItem, WALLET_ADDRESSES, JSON.stringify(walletAddressesData))
  } catch (e) {
    yield put(
      refreshWalletAddressesFail({
        ...ERROR_REFRESHING_WALLET_ADDRESSES,
        message: `${ERROR_REFRESHING_WALLET_ADDRESSES.message} ${e.message}`,
      })
    )
  }
}

export const walletBalanceRefreshed = (walletBalanceData: number) => ({
  type: WALLET_BALANCE_REFRESHED,
  walletBalance: {
    data: walletBalanceData,
    status: STORE_STATUS.SUCCESS,
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

//TODO check
export const refreshWalletStoreFail = (error: CustomError) => ({
  type: REFRESH_WALLET_STORE_FAIL,
  error,
  status: STORE_STATUS.ERROR,
})

export const refreshWalletBalanceFail = (error: CustomError) => ({
  type: REFRESH_WALLET_BALANCE_FAIL,
  error,
  status: STORE_STATUS.ERROR,
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

export default function walletReducer(
  state: WalletStore = initialState,
  action: WalletStoreAction
) {
  switch (action.type) {
    case HYDRATE_WALLET_STORE: {
      const {
        walletBalance = state.walletBalance,
        walletAddresses = state.walletAddresses,
        walletHistory = state.walletHistory,
      } = action.data

      return {
        ...state,
        walletBalance,
        walletAddresses,
        walletHistory,
      }
    }
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
    case HYDRATE_WALLET_STORE_FAIL: {
      return {
        ...state,
        error: action.error,
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
    case RESET:
      return initialState
    default:
      return state
  }
}

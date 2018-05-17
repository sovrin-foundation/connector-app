// @flow
import { put, call, select, all } from 'redux-saga/effects'
import walletReducer, {
  refreshWalletStoreFail,
  refreshWalletHistory,
  hydrateWalletStoreSaga,
  hydrateWalletBalanceSaga,
  hydrateWalletAddressesSaga,
  hydrateWalletHistorySaga,
  walletBalanceRefreshed,
  walletAddressesRefreshed,
  walletHistoryRefreshed,
  hydrateWalletBalanceStore,
  hydrateWalletAddressesStore,
  hydrateWalletHistoryStore,
  hydrateWalletBalanceFail,
  hydrateWalletAddressesFail,
  hydrateWalletHistoryFail,
  refreshWalletBalanceFail,
  refreshWalletAddressesFail,
  refreshWalletHistoryFail,
} from '../wallet-store'
import { initialTestAction } from '../../common/type-common'
import {
  walletBalance,
  walletAddresses,
  walletHistory,
} from '../../../__mocks__/static-data'
import {
  ERROR_LOADING_WALLET,
  ERROR_REFRESHING_WALLET_BALANCE,
  STORE_STATUS,
  ERROR_LOADING_WALLET_BALANCE,
  ERROR_LOADING_WALLET_ADDRESSES,
  ERROR_LOADING_WALLET_HISTORY,
  ERROR_REFRESHING_WALLET_ADDRESSES,
  ERROR_REFRESHING_WALLET_HISTORY,
} from '../type-wallet'
import { WALLET_BALANCE, WALLET_ADDRESSES, WALLET_HISTORY } from '../../common'
import { setItem, getItem } from '../../services/secure-storage'

//TODO fix test
describe('store: wallet-store: ', () => {
  let initialState

  beforeEach(() => {
    initialState = {
      walletBalance: { data: 0, status: STORE_STATUS.IDLE, error: null },
      walletAddresses: { data: [], status: STORE_STATUS.IDLE, error: null },
      walletHistory: {
        transactions: [],
        status: STORE_STATUS.IDLE,
        error: null,
      },
    }
  })

  it('action: HYDRATE_WALLET_BALANCE', () => {
    expect(
      walletReducer(initialState, hydrateWalletBalanceStore(walletBalance.data))
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_WALLET_ADDRESSES', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletAddressesStore(walletAddresses.data)
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_WALLET_HISTORY', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletHistoryStore(walletHistory.transactions)
      )
    ).toMatchSnapshot()
  })

  it('action: WALLET_BALANCE_REFRESHED', () => {
    expect(
      walletReducer(initialState, walletBalanceRefreshed(walletBalance.data))
    ).toMatchSnapshot()
  })

  it('action: WALLET_ADDRESSES_REFRESHED', () => {
    expect(
      walletReducer(
        initialState,
        walletAddressesRefreshed(walletAddresses.data)
      )
    ).toMatchSnapshot()
  })

  it('action: WALLET_HISTORY_REFRESHED', () => {
    expect(
      walletReducer(
        initialState,
        walletHistoryRefreshed(walletHistory.transactions)
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_WALLET_BALANCE_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletBalanceFail(ERROR_LOADING_WALLET_BALANCE)
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_WALLET_ADDRESSES_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletAddressesFail(ERROR_LOADING_WALLET_ADDRESSES)
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_WALLET_HISTORY_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletHistoryFail(ERROR_LOADING_WALLET_HISTORY)
      )
    ).toMatchSnapshot()
  })

  it('action: WALLET_BALANCE_REFRESHED', () => {
    expect(
      walletReducer(initialState, walletBalanceRefreshed(walletBalance.data))
    ).toMatchSnapshot()
  })

  it('action: WALLET_ADDRESSES_REFRESHED', () => {
    expect(
      walletReducer(
        initialState,
        walletAddressesRefreshed(walletAddresses.data)
      )
    ).toMatchSnapshot()
  })

  it('action: WALLET_HISTORY_REFRESHED', () => {
    expect(
      walletReducer(
        initialState,
        walletHistoryRefreshed(walletHistory.transactions)
      )
    ).toMatchSnapshot()
  })

  it('action: REFRESH_WALLET_BALANCE_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        refreshWalletBalanceFail(ERROR_REFRESHING_WALLET_BALANCE)
      )
    ).toMatchSnapshot()
  })

  it('action: REFRESH_WALLET_ADDRESSES_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        refreshWalletAddressesFail(ERROR_REFRESHING_WALLET_ADDRESSES)
      )
    ).toMatchSnapshot()
  })

  it('action: REFRESH_WALLET_HISTORY_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        refreshWalletHistoryFail(ERROR_REFRESHING_WALLET_HISTORY)
      )
    ).toMatchSnapshot()
  })

  it('saga: hydrateWalletStoreSaga => success', () => {
    const gen = hydrateWalletStoreSaga()
    expect(gen.next().value).toEqual(
      all([
        call(hydrateWalletBalanceSaga),
        call(hydrateWalletAddressesSaga),
        call(hydrateWalletHistorySaga),
      ])
    )
  })

  xit('saga: hydrateWalletBalanceSaga => success', () => {
    const gen = hydrateWalletBalanceSaga()
    expect(gen.next().value).toEqual(call(getItem, WALLET_BALANCE))
  })

  xit('saga: refreshWalletSaga => success', () => {})

  xit('saga: refreshWalletSaga => fail', () => {})
})

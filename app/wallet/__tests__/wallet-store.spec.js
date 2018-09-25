// @flow
import { put, call, select, all } from 'redux-saga/effects'
import walletReducer, {
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
  backupWalletFail,
  walletBackup,
  walletBackupComplete,
  sendTokensFail,
  walletInitialState,
  getAmountToTransfer,
  sendTokens,
  sendTokensSaga,
  tokenSentSuccess,
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
  ERROR_BACKUP_WALLET,
  ERROR_BACKUP_WALLET_SHARE,
  ERROR_LOADING_WALLET_BALANCE,
  ERROR_LOADING_WALLET_ADDRESSES,
  ERROR_LOADING_WALLET_HISTORY,
  ERROR_REFRESHING_WALLET_ADDRESSES,
  ERROR_REFRESHING_WALLET_HISTORY,
  ERROR_SENDING_TOKENS,
  ERROR_SENDING_TOKENS_WITH_FEES,
} from '../type-wallet'
import { WALLET_BALANCE, WALLET_ADDRESSES, WALLET_HISTORY } from '../../common'
import { secureGet, getHydrationItem } from '../../services/storage'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import {
  getLedgerFees,
  sendTokenAmount,
} from '../../bridge/react-native-cxs/RNCxs'
import BigNumber from 'bignumber.js'
import { VCX_INIT_SUCCESS } from '../../store/type-config-store'

describe('store: wallet-store: ', () => {
  let initialState

  beforeEach(() => {
    initialState = walletInitialState
  })

  it('action: BACKUP_WALLET', () => {
    expect(walletReducer(initialState, walletBackup())).toMatchSnapshot()
  })

  it('action: BACKUP_WALLET_SUCCESS', () => {
    expect(
      walletReducer(initialState, walletBackupComplete('hibob'))
    ).toMatchSnapshot()
  })

  it('action: ERROR_BACKUP_WALLET', () => {
    expect(
      walletReducer(initialState, backupWalletFail(ERROR_BACKUP_WALLET))
    ).toMatchSnapshot()
  })

  it('action: ERROR_BACKUP_WALLET_SHARE', () => {
    expect(
      walletReducer(initialState, backupWalletFail(ERROR_BACKUP_WALLET_SHARE))
    ).toMatchSnapshot()
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
        hydrateWalletAddressesFail({ ...ERROR_LOADING_WALLET_ADDRESSES })
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_WALLET_HISTORY_FAIL', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletHistoryFail({ ...ERROR_LOADING_WALLET_HISTORY })
      )
    ).toMatchSnapshot()
  })

  it('action: WALLET_BALANCE_REFRESHED', () => {
    expect(
      walletReducer(
        initialState,
        hydrateWalletBalanceFail({ ...ERROR_LOADING_WALLET_BALANCE })
      )
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

  it('action: SEND_TOKENS_FAIL', () => {
    expect(
      walletReducer(initialState, sendTokensFail('5656', ERROR_SENDING_TOKENS))
    ).toMatchSnapshot()
  })

  it('action: SEND_TOKENS_FAIL', () => {
    expect(
      walletReducer(initialState, sendTokensFail('5656', ERROR_SENDING_TOKENS))
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

  it('saga: hydrateWalletBalanceSaga => success', () => {
    const walletBalance = '1'

    return expectSaga(hydrateWalletBalanceSaga)
      .provide([
        [matchers.call.fn(getHydrationItem, WALLET_BALANCE), walletBalance],
      ])
      .put(hydrateWalletBalanceStore(walletBalance))
      .run()
  })

  function testGetAmountToTransfer(tokenAmountToTransfer: *, ledgerFees: *) {
    const walletBalance = '1'

    return expectSaga(
      getAmountToTransfer,
      sendTokens(tokenAmountToTransfer, 'recipient-address')
    )
      .withState({
        wallet: { walletBalance: { data: walletBalance } },
      })
      .provide([[matchers.call.fn(getLedgerFees), ledgerFees]])
      .run()
      .then(finalAmount => {
        expect(finalAmount.returnValue.toJSON()).toMatchSnapshot()
      })
  }

  it('getAmountToTransfer, transfer whole balance, fees zero', () => {
    const tokenAmountToTransfer = '1'
    const ledgerFees = {
      transfer: '0',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer whole balance, fees equal to wallet balance', () => {
    const tokenAmountToTransfer = '1'
    const ledgerFees = {
      transfer: '1',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer whole balance, fees greater than wallet balance', () => {
    const tokenAmountToTransfer = '1'
    const ledgerFees = {
      transfer: '1',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer whole balance, fees more than zero less than wallet balance', () => {
    const tokenAmountToTransfer = '1'
    const ledgerFees = {
      transfer: '0.1',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer less than wallet balance, fees zero', () => {
    const tokenAmountToTransfer = '0.5'
    const ledgerFees = {
      transfer: '0',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer less than wallet balance, fees + transfer more than wallet balance ', () => {
    const tokenAmountToTransfer = '0.5'
    const ledgerFees = {
      transfer: '0.6',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer less than wallet balance, fees + transfer equal to wallet balance ', () => {
    const tokenAmountToTransfer = '0.5'
    const ledgerFees = {
      transfer: '0.5',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('getAmountToTransfer, transfer less than wallet balance, fees + transfer less than wallet balance ', () => {
    const tokenAmountToTransfer = '0.5'
    const ledgerFees = {
      transfer: '0.3',
    }

    return testGetAmountToTransfer(tokenAmountToTransfer, ledgerFees)
  })

  it('saga: sendTokensSaga => success', () => {
    const walletBalance = '1'
    const stateWithVcxInitSuccess = {
      config: {
        vcxInitializationState: VCX_INIT_SUCCESS,
      },
      wallet: { walletBalance: { data: walletBalance } },
    }
    const tokenAmount = '0.9'
    const recipientAddress = 'recipientAddress'
    const ledgerFees = {
      transfer: '0.1',
    }

    return expectSaga(sendTokensSaga, sendTokens(tokenAmount, recipientAddress))
      .withState(stateWithVcxInitSuccess)
      .provide([
        [matchers.call.fn(getLedgerFees), ledgerFees],
        [matchers.call.fn(sendTokenAmount, tokenAmount, recipientAddress), {}],
      ])
      .call(sendTokenAmount, tokenAmount, recipientAddress)
      .put(tokenSentSuccess(tokenAmount))
      .run()
  })

  it('saga: sendTokensSaga => fail', () => {
    const walletBalance = '1'
    const stateWithVcxInitSuccess = {
      config: {
        vcxInitializationState: VCX_INIT_SUCCESS,
      },
      wallet: { walletBalance: { data: walletBalance } },
    }
    const tokenAmount = '2'
    const recipientAddress = 'recipientAddress'
    const ledgerFees = {
      transfer: '0.1',
    }

    return expectSaga(sendTokensSaga, sendTokens(tokenAmount, recipientAddress))
      .withState(stateWithVcxInitSuccess)
      .provide([[matchers.call.fn(getLedgerFees), ledgerFees]])
      .put(sendTokensFail(tokenAmount, ERROR_SENDING_TOKENS_WITH_FEES))
      .run()
  })
})

// @flow

import { ledgerStoreReducer, getLedgerFeesSaga } from '../ledger-store'
import {
  getLedgerFees,
  getLedgerFeesSuccess,
  ERROR_GET_LEDGER_FEES,
  getLedgerFeesFail,
  resetLedgerFees,
} from '../type-ledger-store'
import { transferFees } from '../../../../__mocks__/data/ledger-store-mock-data'
import { configStoreHydratedInstalledVcxInitSuccess } from '../../../../__mocks__/data/config-store-mock-data'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { getLedgerFees as getLedgerFeesApi } from '../../../bridge/react-native-cxs/RNCxs'

describe('ledgerStore', () => {
  it('action: GET_LEDGER_FEES', () => {
    expect(ledgerStoreReducer(undefined, getLedgerFees())).toMatchSnapshot()
  })

  it('action: GET_LEDGER_FEES_SUCCESS', () => {
    const stateAfterLedgerFeesStart = ledgerStoreReducer(
      undefined,
      getLedgerFees()
    )
    expect(
      ledgerStoreReducer(
        stateAfterLedgerFeesStart,
        getLedgerFeesSuccess(transferFees)
      )
    ).toMatchSnapshot()
  })

  it('action: GET_LEDGER_FEES_FAIL', () => {
    const stateAfterLedgerFeesStart = ledgerStoreReducer(
      undefined,
      getLedgerFees()
    )
    const error = ERROR_GET_LEDGER_FEES('Test error')
    expect(
      ledgerStoreReducer(stateAfterLedgerFeesStart, getLedgerFeesFail(error))
    ).toMatchSnapshot()
  })

  it('action: RESET_LEDGER_FEES', () => {
    const stateAfterLedgerFeesStart = ledgerStoreReducer(
      undefined,
      getLedgerFees()
    )
    const stateAfterSuccess = ledgerStoreReducer(
      stateAfterLedgerFeesStart,
      getLedgerFeesSuccess(transferFees)
    )
    expect(
      ledgerStoreReducer(stateAfterSuccess, resetLedgerFees())
    ).toMatchSnapshot()
  })

  it('saga: getLedgerFeesSaga => success', () => {
    const stateWithVcxSuccess = {
      config: configStoreHydratedInstalledVcxInitSuccess,
    }

    return expectSaga(getLedgerFeesSaga, getLedgerFees())
      .withState(stateWithVcxSuccess)
      .provide([[matchers.call.fn(getLedgerFeesApi), transferFees]])
      .put(getLedgerFeesSuccess(transferFees))
      .run()
  })

  it('saga: getLedgerFeesSaga => fail', () => {
    const stateWithVcxSuccess = {
      config: configStoreHydratedInstalledVcxInitSuccess,
    }
    const errorMessage = 'test error'
    const error = new Error(errorMessage)

    return expectSaga(getLedgerFeesSaga, getLedgerFees())
      .withState(stateWithVcxSuccess)
      .provide([[matchers.call.fn(getLedgerFeesApi), throwError(error)]])
      .put(getLedgerFeesFail(ERROR_GET_LEDGER_FEES(errorMessage)))
      .run()
  })
})

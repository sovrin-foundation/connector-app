// @flow

import { STORE_STATUS } from '../../common/type-common'
import {
  GET_LEDGER_FEES,
  getLedgerFeesFail,
  ERROR_GET_LEDGER_FEES,
  getLedgerFeesSuccess,
  GET_LEDGER_FEES_SUCCESS,
  GET_LEDGER_FEES_FAIL,
  RESET_LEDGER_FEES,
} from './type-ledger-store'
import type {
  LedgerAction,
  LedgerStore,
  LedgerFeesData,
} from './type-ledger-store'
import { put, take, all, call, select, takeLatest } from 'redux-saga/effects'
import { getLedgerFees } from '../../bridge/react-native-cxs/RNCxs'
import { ensureVcxInitSuccess } from '../config-store'

const initialState = {
  fees: {
    data: {
      transfer: '0',
    },
    status: STORE_STATUS.IDLE,
    error: null,
  },
}

export function* getLedgerFeesSaga(): Generator<*, *, *> {
  yield* ensureVcxInitSuccess()
  try {
    const fees: LedgerFeesData = yield call(getLedgerFees)
    yield put(getLedgerFeesSuccess(fees))
  } catch (e) {
    yield put(getLedgerFeesFail(ERROR_GET_LEDGER_FEES(e.message)))
  }
}

export function* watchGetLedgerFees(): any {
  yield takeLatest(GET_LEDGER_FEES, getLedgerFeesSaga)
}

export function* watchLedgerStore(): any {
  yield all([watchGetLedgerFees()])
}

export function ledgerStoreReducer(
  state: LedgerStore = initialState,
  action: LedgerAction
): LedgerStore {
  switch (action.type) {
    case GET_LEDGER_FEES:
      return {
        ...state,
        fees: {
          ...state.fees,
          status: STORE_STATUS.IN_PROGRESS,
          error: null,
        },
      }

    case GET_LEDGER_FEES_SUCCESS:
      return {
        ...state,
        fees: {
          ...state.fees,
          status: STORE_STATUS.SUCCESS,
          error: null,
          data: {
            ...action.fees,
          },
        },
      }

    case GET_LEDGER_FEES_FAIL:
      return {
        ...state,
        fees: {
          ...state.fees,
          status: STORE_STATUS.ERROR,
          error: action.error,
        },
      }

    case RESET_LEDGER_FEES:
      return initialState

    default:
      return state
  }
}

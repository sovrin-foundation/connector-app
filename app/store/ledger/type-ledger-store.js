// @flow

import type {
  StoreStatus,
  StoreError,
  CustomError,
} from '../../common/type-common'

export type LedgerStore = {
  +fees: LedgerFees,
}

export type LedgerAction =
  | GetLedgerFeesAction
  | GetLedgerFeesSuccessAction
  | GetLedgerFeesFailAction
  | ResetLedgerFeesAction

export type LedgerFees = {
  data: LedgerFeesData,
} & StoreError &
  StoreStatus

export type LedgerFeesData = {
  +transfer: string,
}

export const GET_LEDGER_FEES = 'GET_LEDGER_FEES'
export const getLedgerFees = () => ({
  type: GET_LEDGER_FEES,
})
export type GetLedgerFeesFn = typeof getLedgerFees
export type GetLedgerFeesAction = {
  type: typeof GET_LEDGER_FEES,
}

export const GET_LEDGER_FEES_SUCCESS = 'GET_LEDGER_FEES_SUCCESS'
export const getLedgerFeesSuccess = (fees: LedgerFeesData) => ({
  type: GET_LEDGER_FEES_SUCCESS,
  fees,
})
export type GetLedgerFeesSuccessAction = {
  type: typeof GET_LEDGER_FEES_SUCCESS,
  fees: LedgerFeesData,
}

export const GET_LEDGER_FEES_FAIL = 'GET_LEDGER_FEES_FAIL'
export const getLedgerFeesFail = (error: CustomError) => ({
  type: GET_LEDGER_FEES_FAIL,
  error,
})
export type GetLedgerFeesFailAction = {
  type: typeof GET_LEDGER_FEES_FAIL,
  error: CustomError,
}
export const ERROR_GET_LEDGER_FEES = (message: string) => ({
  code: 'LE-001',
  message: `Error occurred while fetching ledger fees: ${message}`,
})

export const RESET_LEDGER_FEES = 'RESET_LEDGER_FEES'
export const resetLedgerFees = () => ({
  type: RESET_LEDGER_FEES,
})
export type ResetLedgerFeesFn = typeof resetLedgerFees
export type ResetLedgerFeesAction = {
  type: typeof RESET_LEDGER_FEES,
}

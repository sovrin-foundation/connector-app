// @flow
import { takeLatest, all } from 'redux-saga/effects'
import { LAUNCH_ONFIDO_SDK } from './type-onfido'
import type {
  OnfidoStore,
  OnfidoStoreAction,
  LaunchOnfidoSDKAction,
} from './type-onfido'

const initialState = {}

export function* launchOnfidoSDK(
  action: LaunchOnfidoSDKAction
): Generator<*, *, *> {}

function* watchOnfidoStart(): any {
  yield takeLatest(LAUNCH_ONFIDO_SDK, launchOnfidoSDK)
}

export function* watchOnfido(): any {
  yield all([watchOnfidoStart()])
}

export default function onfidoReducer(
  state: OnfidoStore = initialState,
  action: OnfidoStoreAction
) {
  switch (action.type) {
    default:
      return state
  }
}

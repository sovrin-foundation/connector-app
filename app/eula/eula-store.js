// @flow
import { takeLatest } from 'redux-saga/effects'
import { EULA_ACCEPT } from './type-eula'
import type { EulaAccept, EulaStore, EulaActions } from './type-eula'

const initialState: EulaStore = {
  isEulaAccept: false,
}

export const eulaAccept = (isEulaAccept: boolean): EulaAccept => ({
  type: EULA_ACCEPT,
  isEulaAccept,
})

export default function eulaReducer(
  state: EulaStore = initialState,
  action: EulaActions
): EulaStore {
  switch (action.type) {
    case EULA_ACCEPT:
      return {
        ...state,
        isEulaAccept: action.isEulaAccept,
      }
    default:
      return state
  }
}

// @flow
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { safeSet } from '../services/storage'
import {
  EULA_ACCEPT,
  STORAGE_KEY_EULA_ACCEPTANCE,
  HYDRATE_EULA_ACCEPT,
} from './type-eula'
import type {
  EulaAccept,
  EulaStore,
  EulaActions,
  HydrateEulaAcceptAction,
} from './type-eula'

const initialState: EulaStore = {
  isEulaAccept: false,
}

export const eulaAccept = (isEulaAccept: boolean): EulaAccept => ({
  type: EULA_ACCEPT,
  isEulaAccept,
})

// if we see that both this action and eulaAccept action creator
// does the same thing inside the reducer and while raising action as well
// the reason we have two action creators is that on EULA_ACCEPT
// we have a watch that runs and store this data inside wallet
// we do not want to wastefully make an API call when we just hydrated data
export const hydrateEulaAccept = (
  isEulaAccept: boolean
): HydrateEulaAcceptAction => ({
  type: HYDRATE_EULA_ACCEPT,
  isEulaAccept,
})

export function* watchEula(): any {
  yield all([watchEulaAcceptance()])
}

export function* watchEulaAcceptance(): any {
  yield takeLatest(EULA_ACCEPT, eulaAcceptanceSaga)
}

export function* eulaAcceptanceSaga(action: EulaAccept): Generator<*, *, *> {
  try {
    const { isEulaAccept } = action

    yield call(
      safeSet,
      STORAGE_KEY_EULA_ACCEPTANCE,
      JSON.stringify(isEulaAccept)
    )
  } catch (e) {
    console.error(`eulaAcceptanceSaga: ${e}`)
  }
}

export default function eulaReducer(
  state: EulaStore = initialState,
  action: EulaActions
): EulaStore {
  switch (action.type) {
    case HYDRATE_EULA_ACCEPT:
    case EULA_ACCEPT:
      return {
        ...state,
        isEulaAccept: action.isEulaAccept,
      }
    default:
      return state
  }
}

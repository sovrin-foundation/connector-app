// @flow
import { AsyncStorage } from 'react-native'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { EULA_ACCEPT, STORAGE_KEY_EULA_ACCEPTANCE } from './type-eula'
import type { EulaAccept, EulaStore, EulaActions } from './type-eula'

const initialState: EulaStore = {
  isEulaAccept: false,
}

export const eulaAccept = (isEulaAccept: boolean): EulaAccept => ({
  type: EULA_ACCEPT,
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
      AsyncStorage.setItem,
      STORAGE_KEY_EULA_ACCEPTANCE,
      JSON.stringify(isEulaAccept)
    )
  } catch (e) {
    yield put(eulaAccept(false))
  }
}

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

// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import { setItem, getItem, deleteItem } from '../../services/secure-storage'
import type { Saga } from 'redux-saga'

import {
  CONNECT_REGISTER_CREATE_AGENT_DONE,
  HYDRATE_USER_STORE,
  STORAGE_KEY_USER_ONE_TIME_INFO,
  SAVE_USER_ONE_TIME_INFO_FAIL,
  ERROR_SAVE_USER_INFO_FAIL,
  ERROR_PARSE_USER_INFO_FAIL,
  PARSE_USER_ONE_TIME_INFO_FAIL,
} from './type-user-store'
import type {
  UserStore,
  UserStoreAction,
  UserOneTimeInfo,
  ConnectRegisterCreateAgentDoneAction,
} from './type-user-store'
import type { CustomError } from '../../common/type-common'
import { RESET } from '../../common/type-common'

const initialState = {
  isFetching: false,
  error: null,
  userOneTimeInfo: null,
}

export const connectRegisterCreateAgentDone = (
  userOneTimeInfo: UserOneTimeInfo
) => ({
  type: CONNECT_REGISTER_CREATE_AGENT_DONE,
  userOneTimeInfo,
})

export const saveUserOneTimeInfoFail = (error: CustomError) => ({
  type: SAVE_USER_ONE_TIME_INFO_FAIL,
  error,
})

export function* saveUserOneTimeInfoSaga(
  action: ConnectRegisterCreateAgentDoneAction
): Saga<void> {
  const { userOneTimeInfo } = action
  try {
    yield call(
      setItem,
      STORAGE_KEY_USER_ONE_TIME_INFO,
      JSON.stringify(userOneTimeInfo)
    )
  } catch (e) {
    // we need to add some fallback if user storage is not available
    // or is full or if user deleted our data
    yield put(
      saveUserOneTimeInfoFail({
        code: ERROR_SAVE_USER_INFO_FAIL.code,
        message: `${ERROR_SAVE_USER_INFO_FAIL.message}${e.message}`,
      })
    )
  }
}

function* watchConnectRegisterCreateAgent(): any {
  yield takeLatest(CONNECT_REGISTER_CREATE_AGENT_DONE, saveUserOneTimeInfoSaga)
}

export const hydrateUserStore = (userOneTimeInfo: UserOneTimeInfo) => ({
  type: HYDRATE_USER_STORE,
  userOneTimeInfo,
})

export const hydrateUserStoreFail = (error: CustomError) => ({
  type: PARSE_USER_ONE_TIME_INFO_FAIL,
  error,
})

export function* hydrateUserStoreSaga(): Generator<*, *, *> {
  try {
    const userOneTimeInfo = yield call(getItem, STORAGE_KEY_USER_ONE_TIME_INFO)
    if (userOneTimeInfo) {
      const userOneTimeInfoParsed: UserOneTimeInfo = JSON.parse(userOneTimeInfo)
      yield put(hydrateUserStore(userOneTimeInfoParsed))
    }
  } catch (e) {
    yield put(
      hydrateUserStoreFail({
        code: ERROR_PARSE_USER_INFO_FAIL.code,
        message: `${ERROR_PARSE_USER_INFO_FAIL.message}${e.message}`,
      })
    )
  }
}

export function* watchUserStore(): Saga<void> {
  yield all([watchConnectRegisterCreateAgent()])
}

export default function user(
  state: UserStore = initialState,
  action: UserStoreAction
) {
  switch (action.type) {
    case CONNECT_REGISTER_CREATE_AGENT_DONE:
      return {
        ...state,
        userOneTimeInfo: action.userOneTimeInfo,
      }
    case PARSE_USER_ONE_TIME_INFO_FAIL:
      return {
        ...state,
        error: action.error,
      }
    case SAVE_USER_ONE_TIME_INFO_FAIL:
      return {
        ...state,
        error: action.error,
      }
    case HYDRATE_USER_STORE:
      return {
        ...state,
        userOneTimeInfo: action.userOneTimeInfo,
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

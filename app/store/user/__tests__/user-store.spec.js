// @flow
import { put, call } from 'redux-saga/effects'

import userReducer, {
  connectRegisterCreateAgentDone,
  hydrateUserStoreFail,
  saveUserOneTimeInfoFail,
  hydrateUserStore,
  hydrateUserStoreSaga,
  saveUserOneTimeInfoSaga,
} from '../user-store'
import { initialTestAction } from '../../../common/type-common'
import { userOneTimeInfo } from '../../../../__mocks__/static-data'
import {
  ERROR_PARSE_USER_INFO_FAIL,
  ERROR_SAVE_USER_INFO_FAIL,
  STORAGE_KEY_USER_ONE_TIME_INFO,
} from '../type-user-store'
import { setItem, getItem } from '../../../services/secure-storage'

describe('store: user-store: ', () => {
  let initialState

  beforeEach(() => {
    // get initial state without any action
    initialState = userReducer(undefined, initialTestAction())
  })

  it('action: CONNECT_REGISTER_CREATE_AGENT_DONE', () => {
    expect(
      userReducer(initialState, connectRegisterCreateAgentDone(userOneTimeInfo))
    ).toMatchSnapshot()
  })

  it('action: PARSE_USER_ONE_TIME_INFO_FAIL', () => {
    expect(
      userReducer(
        initialState,
        hydrateUserStoreFail(ERROR_PARSE_USER_INFO_FAIL)
      )
    ).toMatchSnapshot()
  })

  it('action: SAVE_USER_ONE_TIME_INFO_FAIL', () => {
    expect(
      userReducer(
        initialState,
        saveUserOneTimeInfoFail(ERROR_SAVE_USER_INFO_FAIL)
      )
    ).toMatchSnapshot()
  })

  it('action: HYDRATE_USER_STORE', () => {
    expect(
      userReducer(initialState, hydrateUserStore(userOneTimeInfo))
    ).toMatchSnapshot()
  })

  it('saga: saveUserOneTimeInfoSaga => success', () => {
    const gen = saveUserOneTimeInfoSaga(
      connectRegisterCreateAgentDone(userOneTimeInfo)
    )
    expect(gen.next().value).toEqual(
      call(
        setItem,
        STORAGE_KEY_USER_ONE_TIME_INFO,
        JSON.stringify(userOneTimeInfo)
      )
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: saveUserOneTimeInfoSaga => fail', () => {
    const gen = saveUserOneTimeInfoSaga(
      connectRegisterCreateAgentDone(userOneTimeInfo)
    )

    expect(gen.next().value).toEqual(
      call(
        setItem,
        STORAGE_KEY_USER_ONE_TIME_INFO,
        JSON.stringify(userOneTimeInfo)
      )
    )

    const errorMessage = 'No storage available'
    expect(gen.throw(new Error(errorMessage)).value).toEqual(
      put(
        saveUserOneTimeInfoFail({
          code: ERROR_SAVE_USER_INFO_FAIL.code,
          message: `${ERROR_SAVE_USER_INFO_FAIL.message}${errorMessage}`,
        })
      )
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: hydrateUserStoreSaga => success', () => {
    const gen = hydrateUserStoreSaga()
    expect(gen.next().value).toEqual(
      call(getItem, STORAGE_KEY_USER_ONE_TIME_INFO)
    )
    expect(gen.next(JSON.stringify(userOneTimeInfo)).value).toEqual(
      put(hydrateUserStore(userOneTimeInfo))
    )
    expect(gen.next().done).toBe(true)
  })

  it('saga: hydrateUserStoreSaga => fail', () => {
    const gen = hydrateUserStoreSaga()
    expect(gen.next().value).toEqual(
      call(getItem, STORAGE_KEY_USER_ONE_TIME_INFO)
    )
    const error = 'test error'
    expect(gen.throw(new Error(error)).value).toEqual(
      put(
        hydrateUserStoreFail({
          code: ERROR_PARSE_USER_INFO_FAIL.code,
          message: `${ERROR_PARSE_USER_INFO_FAIL.message}${error}`,
        })
      )
    )
    expect(gen.next().done).toBe(true)
  })
})

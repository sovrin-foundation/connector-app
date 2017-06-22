import { put, takeLatest, call } from 'redux-saga/effects'
import { sendUserInfo as sendUserInfoApi } from '../services/api'

// import hardcoded data as of now
import userInfo from './data/user'

const initResponseData = {
  data: {},
  isFetching: false,
  isPristine: true,
  error: {
    code: '',
    message: '',
  },
}

// initial state for home
const initialState = {
  ...initResponseData,
  userInfoResponse: initResponseData,
}

const GET_USERINFO = 'GET_USERINFO'
const GET_USERINFO_SUCCESS = 'GET_USERINFO_SUCCESS'
const GET_USERINFO_FAIL = 'GET_USERINFO_FAIL'
const SEND_USER_INFO = 'SEND_USER_INFO'
const SEND_USER_INFO_SUCCESS = 'SEND_USER_INFO_SUCCESS'
const SEND_USER_INFO_FAIL = 'SEND_USER_INFO_FAIL'

export const getUserInfo = () => ({
  type: GET_USERINFO,
})

export const getUserInfoFailed = error => ({
  type: GET_USERINFO_FAIL,
  error,
})

export const getUserInfoSuccess = info => ({
  type: GET_USERINFO_SUCCESS,
  info,
})

export function* loadUserInfoSaga() {
  yield put(getUserInfoSuccess(userInfo))
}

export function* watchUserInfo() {
  yield takeLatest(GET_USERINFO, loadUserInfoSaga)
}

export const sendUserInfo = (userInfo, config) => ({
  type: SEND_USER_INFO,
  userInfo,
  config,
})

export const sendUserInfoFailed = error => ({
  type: SEND_USER_INFO_FAIL,
  error,
})

export const sendUserInfoSuccess = info => ({
  type: SEND_USER_INFO_SUCCESS,
  info,
})

function* sendUserInfoSaga(action) {
  try {
    const info = yield call(sendUserInfoApi, action.userInfo, action.config)
    yield put(sendUserInfoSuccess(info))
  } catch (e) {
    yield put(sendUserInfoFailed(e.message))
  }
}

export function* watchSendUserInfo() {
  yield takeLatest(SEND_USER_INFO, sendUserInfoSaga)
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case GET_USERINFO:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
        error: initialState.error,
      }
    case GET_USERINFO_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case GET_USERINFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.info,
      }
    case SEND_USER_INFO:
      return {
        ...state,
        userInfoResponse: {
          ...state.userInfoResponse,
          isFetching: true,
          isPristine: false,
        },
      }
    case SEND_USER_INFO_FAIL:
      return {
        ...state,
        userInfoResponse: {
          ...state.userInfoResponse,
          isFetching: false,
          data: action.userInfoResponse,
        },
      }
    case SEND_USER_INFO_SUCCESS:
      return {
        ...state,
        userInfoResponse: {
          ...state.userInfoResponse,
          isFetching: false,
          error: action.error,
        },
      }
    default:
      return state
  }
}

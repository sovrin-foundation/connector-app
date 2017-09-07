import { put, takeLatest, call } from 'redux-saga/effects'

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
    default:
      return state
  }
}

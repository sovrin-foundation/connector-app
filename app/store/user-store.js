import { put, takeLatest } from "redux-saga/effects";

// import hardcoded data as of now
import userInfo from './data/user';

const GET_USERINFO = "GET_USERINFO";
const GET_USERINFO_SUCCESS = "GET_USERINFO_SUCCESS";
const GET_USERINFO_FAIL = "GET_USERINFO_FAIL";

export const getUserInfo = () => ({
  type: GET_USERINFO
});

export const getUserInfoFailed = error => ({
  type: GET_USERINFO_FAIL,
  error
});

export const getUserInfoSuccess = info => ({
  type: GET_USERINFO_SUCCESS,
  info
});

// initial state for home
const initialState = {
  data: {},
  isFetching: false,
  isPristine: true,
  error: {
    code: "",
    message: ""
  }
};

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
        error: initialState.error
      };
    case GET_USERINFO_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case GET_USERINFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.info
      };
    default:
      return state;
  }
}

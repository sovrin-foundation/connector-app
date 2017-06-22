import { call, put, takeLatest } from 'redux-saga/effects'
import { enrollUser, sendUserInfo } from '../services/api'
import { IDENTIFIER, PHONE } from '../common/secure-storage-constants'
import { setItem } from '../services/secure-storage'

const initResponseData = {
  isFetching: false,
  isPristine: true,
  data: null,
  error: null,
}

const initialState = {
  avatarTapCount: 0,
  enrollResponse: initResponseData,
  userInfoResponse: initResponseData,
}

export const enroll = (device, config) => ({
  type: 'ENROLL',
  device,
  config,
})

const enrollSuccess = enrollResponse => ({
  type: 'ENROLL_SUCCESS',
  enrollResponse,
})

const enrollFailure = error => ({
  type: 'ENROLL_FAILURE',
  error,
})

function* handleEnroll(action) {
  try {
    const enrollResponse = yield call(enrollUser, action.device, action.config)
    setItem(PHONE, action.device.phoneNumber)
    setItem(IDENTIFIER, action.device.id)
    yield put(enrollSuccess(enrollResponse))
  } catch (e) {
    yield put(enrollFailure(e.message))
  }
}

export function* watchEnrollUser() {
  yield takeLatest('ENROLL', handleEnroll)
}

export const avatarTapped = () => ({
  type: 'AVATAR_TAPPED',
})

export const resetAvatarTapCount = () => ({
  type: 'RESET_AVATAR_TAP_COUNT',
})

export default function home(state = initialState, action) {
  switch (action.type) {
    case 'ENROLL':
      return {
        ...state,
        enrollResponse: {
          ...state.enrollResponse,
          isFetching: true,
          isPristine: false,
        },
      }
    case 'ENROLL_SUCCESS':
      return {
        ...state,
        enrollResponse: {
          ...state.enrollResponse,
          isFetching: false,
          data: action.enrollResponse,
        },
      }
    case 'ENROLL_FAILURE':
      return {
        ...state,
        enrollResponse: {
          ...state.enrollResponse,
          isFetching: false,
          error: action.error,
        },
      }
    case 'AVATAR_TAPPED':
      return {
        ...state,
        avatarTapCount: state.avatarTapCount + 1,
      }
    case 'RESET_AVATAR_TAP_COUNT':
      return {
        ...state,
        avatarTapCount: 0,
      }
    default:
      return state
  }
}

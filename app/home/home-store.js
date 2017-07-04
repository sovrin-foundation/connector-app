import { call, put, takeLatest } from 'redux-saga/effects'
import { enrollUser, sendUserInfo } from '../services/api'
import { IDENTIFIER, PHONE } from '../common/secure-storage-constants'
import { setItem } from '../services/secure-storage'
import { appInstalledSuccess } from '../store/config-store'

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

export const enrollSuccess = enrollResponse => ({
  type: 'ENROLL_SUCCESS',
  enrollResponse,
})

export const enrollFailure = error => ({
  type: 'ENROLL_FAILURE',
  error,
})

function* handleEnroll(action) {
  try {
    // todo: enroll api call not needed anyone, will remove this later after testing
    // const enrollResponse = yield call(enrollUser, action.device, action.config)
    setItem(PHONE, action.device.phoneNumber)
    setItem(IDENTIFIER, action.device.id)
    // todo: enroll api success call not needed anyone, will remove this later after testing
    yield put(enrollSuccess({ status: 200 }))
    // use this action to trigger config change once user is registered
    // so that user is not registered again
    yield put(appInstalledSuccess())
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

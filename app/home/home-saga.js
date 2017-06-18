import { call, put, takeLatest } from 'redux-saga/effects'
import { enrollUser, pollAuthRequest, sendUserInfo } from '../services/api'
import { poll, avatarTapped } from './home-store'

const enrollSuccess = enrollResponse => ({
  type: 'ENROLL_SUCCESS',
  enrollResponse,
})

const enrollFailure = enrollResponse => ({
  type: 'ENROLL_FAILURE',
  enrollResponse,
})

function* handleEnroll(action) {
  try {
    const enrollResponse = yield call(enrollUser, action.device)
    yield put(enrollSuccess(enrollResponse))
    yield put(poll(action.device.id))
  } catch (e) {
    yield put(enrollFailure(e.message))
  }
}

export function* watchEnrollUser() {
  yield takeLatest('ENROLL', handleEnroll)
}

const userInfoSuccess = userInfoResponse => ({
  type: 'USER_INFO_SUCCESS',
  userInfoResponse,
})

const userInfoFailure = userInfoResponse => ({
  type: 'USER_INFO_FAILURE',
  userInfoResponse,
})

function* userInfo(action) {
  try {
    const userInfoResponse = yield call(sendUserInfo, action.userInfo)
    yield put(userInfoSuccess(userInfoResponse))
  } catch (e) {
    yield put(userInfoSuccess(e.message))
  }
}

export function* watchAppContext() {
  yield takeLatest('SEND_USER_INFO', userInfo)
}

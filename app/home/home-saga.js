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

const pollSuccess = pollResponse => ({
  type: 'POLL_SUCCESS',
  pollResponse,
})

const pollFailure = pollResponse => ({
  type: 'POLL_FAILURE',
  pollResponse,
})

function* handleAuthRequest(action) {
  try {
    const pollResponse = yield call(pollAuthRequest, action.identifier)
    if (pollResponse == 'auth request is not yet sent') {
      yield put(pollSuccess(pollResponse))
      yield put(poll(action.identifier))
    } else {
      yield put(pollSuccess(pollResponse.data))
    }
  } catch (e) {
    yield put(pollFailure(e.message))
    yield put(poll(action.identifier))
  }
}

export function* watchPollAuthRequest() {
  yield takeLatest('POLL', handleAuthRequest)
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

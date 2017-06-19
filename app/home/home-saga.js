import { call, put, takeLatest } from 'redux-saga/effects'
import { enrollUser, sendUserInfo } from '../services/api'
import { avatarTapped, setEnrollItems } from './../store'
import { IDENTIFIER, PHONE } from '../common/secure-storage-constants'
import { setItem } from '../services/secure-storage'

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

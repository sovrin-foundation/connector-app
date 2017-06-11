import { call, put, takeLatest } from 'redux-saga/effects'
import { enroll, poll, sendAppContext } from '../services/api'
import { Poll } from './home-store'

const enrollSuccess = enrollRes => ({
  type: 'ENROLL_SUCCESS',
  enrollRes,
})

const enrollFailure = enrollRes => ({
  type: 'ENROLL_FAILURE',
  enrollRes,
})

function* enrollUser(action) {
  try {
    const enrollRes = yield call(enroll, action.device)
    yield put(enrollSuccess(enrollRes))
    yield put(Poll(action.device.id))
  } catch (e) {
    yield put(enrollFailure(e.message))
  }
}

export function* watchEnrollUser() {
  yield takeLatest('ENROLL', enrollUser)
}

const pollSuccess = pollRes => ({
  type: 'POLL_SUCCESS',
  pollRes,
})

const pollFailure = pollRes => ({
  type: 'POLL_FAILURE',
  pollRes,
})

function* pollAuthRequest(action) {
  try {
    const pollRes = yield call(poll, action.identifier)
    if (pollRes == 'auth request is not yet sent') {
      yield put(pollSuccess(pollRes))
      yield put(Poll(action.identifier))
    } else {
      yield put(pollSuccess(pollRes.data))
    }
  } catch (e) {
    yield put(pollFailure(e.message))
    yield put(Poll(action.identifier))
  }
}

export function* watchPollAuthRequest() {
  yield takeLatest('POLL', pollAuthRequest)
}

const contextSuccess = contextRes => ({
  type: 'CONTEXT_SUCCESS',
  contextRes,
})

const contextFailure = contextRes => ({
  type: 'CONTEXT_FAILURE',
  contextRes,
})

function* appContext(action) {
  try {
    const contextRes = yield call(sendAppContext, action.context)
    yield put(contextSuccess(contextRes.data))
  } catch (e) {
    yield put(contextSuccess(e.message))
  }
}

export function* watchAppContext() {
  yield takeLatest('APP_CONTEXT', appContext)
}

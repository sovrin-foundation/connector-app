import { put, takeLatest, call } from 'redux-saga/effects'
import {
  IDENTIFIER,
  PHONE,
  SEED,
  PUSH_COM_METHOD,
} from '../common/secure-storage-constants'
import { getItem } from '../services/secure-storage'

const initialState = {
  data: {
    identifier: null,
    phone: null,
    seed: null,
    pushComMethod: null,
  },
  isFetching: false,
  isPristine: true,
  error: {
    code: '',
    message: '',
  },
}

const GET_SECURE_STORAGE = 'GET_SECURE_STORAGE'
const GET_SECURE_STORAGE_SUCCESS = 'GET_SECURE_STORAGE_SUCCESS'
const GET_SECURE_STORAGE_ERROR = 'GET_SECURE_STORAGE_ERROR'

export const getSecureStorage = () => ({
  type: GET_SECURE_STORAGE,
})

export const getSecureStorageSuccess = data => ({
  type: GET_SECURE_STORAGE_SUCCESS,
  data,
})

export const getSecureStorageError = error => ({
  type: GET_SECURE_STORAGE_ERROR,
  error,
})

function getSecureStorageItems() {
  return Promise.all([
    getItem(IDENTIFIER),
    getItem(PHONE),
    getItem(SEED),
    getItem(PUSH_COM_METHOD),
  ])
}

export function* loadSecureStorage() {
  try {
    const userSecureStorage = yield call(getSecureStorageItems)
    yield put(getSecureStorageSuccess(userSecureStorage))
  } catch (error) {
    yield put(getSecureStorageError(error))
  }
}

export function* watchSecureStorage() {
  yield takeLatest(GET_SECURE_STORAGE, loadSecureStorage)
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case GET_SECURE_STORAGE:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
      }
    case GET_SECURE_STORAGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isPristine: false,
        data: action.data,
      }
    case GET_SECURE_STORAGE_ERROR:
      return {
        ...state,
        isFetching: false,
        isPristine: false,
        error: action.error,
      }
    default:
      return state
  }
}

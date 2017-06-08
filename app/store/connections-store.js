import { put, takeLatest } from 'redux-saga/effects'

const GET_CONNECTIONS = 'GET_CONNECTIONS'
const GET_CONNECTIONS_SUCCESS = 'GET_CONNECTIONS_SUCCESS'
const GET_CONNECTIONS_FAIL = 'GET_CONNECTIONS_FAIL'

export const getConnections = () => ({
  type: GET_CONNECTIONS,
})

export const getConnectionsFailed = error => ({
  type: GET_CONNECTIONS_FAIL,
  error,
})

export const getConnectionsSuccess = connections => ({
  type: GET_CONNECTIONS_SUCCESS,
  connections,
})

const initialState = {
  data: {},
  isFetching: false,
  isPristine: true,
  error: {
    code: '',
    message: '',
  },
}

export function* loadConnectionsSaga() {
  yield put(getConnectionsSuccess())
}

export function* watchLoadConnections() {
  yield takeLatest(GET_CONNECTIONS, loadConnectionsSaga)
}

export default function connections(state = initialState, action) {
  switch (action.type) {
    case GET_CONNECTIONS:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
        error: initialState.error,
      }
    case GET_CONNECTIONS_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case GET_CONNECTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.connections,
      }
    default:
      return state
  }
}

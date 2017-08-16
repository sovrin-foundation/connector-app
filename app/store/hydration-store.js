import { takeLatest, call, put } from 'redux-saga/effects'
import { getItem } from '../services'
import { updatePushToken } from '../store/push-notification-store'
import { hydrateConnections } from '../store/connections-store'
import { CONNECTIONS, PUSH_COM_METHOD } from '../common'

const initialState = {
  error: {
    code: '',
    message: '',
  },
  isFetching: false,
  isPristine: true,
}

const HYDRATE_APP = 'HYDRATE_APP'
const HYDRATE_APP_SUCCESS = 'HYDRATE_APP_SUCCESS'
const HYDRATE_APP_FAIL = 'HYDRATE_APP_FAIL'

export const hydrateApp = () => ({
  type: HYDRATE_APP,
})

export const hydrateAppSuccess = () => ({
  type: HYDRATE_APP_SUCCESS,
})

export const hydrateAppFail = error => ({
  type: HYDRATE_APP_FAIL,
  error,
})

function* appHydration(action) {
  try {
    const token = yield call(getItem, PUSH_COM_METHOD)
    yield put(updatePushToken(token))

    let connections = yield call(getItem, CONNECTIONS)
    connections = connections ? JSON.parse(connections) : {}
    yield put(hydrateConnections(connections))
    yield put(hydrateAppSuccess())
  } catch (e) {
    yield put(hydrateAppFail(e))
  }
}

export function* watchAppHydration() {
  yield takeLatest(HYDRATE_APP, appHydration)
}

export default function hydration(state = initialState, action) {
  switch (action.type) {
    case HYDRATE_APP:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
      }
    case HYDRATE_APP_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case HYDRATE_APP_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      }
    default:
      return state
  }
}

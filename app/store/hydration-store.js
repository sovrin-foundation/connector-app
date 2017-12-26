import { takeLatest, call, put } from 'redux-saga/effects'
import { getItem, deleteItem } from '../services/secure-storage'
import { updatePushToken } from '../push-notification/push-notification-store'
import { hydrateConnections } from '../store/connections-store'
import { CONNECTIONS, PUSH_COM_METHOD } from '../common'
import { TOUCHID_STORAGE_KEY } from '../lock/type-lock'

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

export const hydrateApp = isAlreadyInstalled => ({
  type: HYDRATE_APP,
  isAlreadyInstalled,
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
    let connections = {}
    if (action.isAlreadyInstalled) {
      // app was already installed and user is just opening the app again
      // or waking up from background
      const token = yield call(getItem, PUSH_COM_METHOD)
      yield put(updatePushToken(token))

      let fetchedConnections = yield call(getItem, CONNECTIONS)
      connections = fetchedConnections ? JSON.parse(fetchedConnections) : {}
    } else {
      // this is the fresh installation of app
      // delete previous stored connections
      yield call(deleteItem, CONNECTIONS)
    }
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

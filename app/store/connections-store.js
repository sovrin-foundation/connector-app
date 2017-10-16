import { put, takeLatest, call, select } from 'redux-saga/effects'
import { encode } from 'bs58'
import { getProfile, connectionMapper, setItem, getItem } from '../services'
import { CONNECTIONS } from '../common'
import { getAgencyUrl } from './store-selector'
import { color } from '../common/styles/constant'
import { encrypt } from '../bridge/react-native-cxs/RNCxs'

const UPDATE_CONNECTION_THEME = 'UPDATE_CONNECTION_THEME'
const NEW_CONNECTION = 'NEW_CONNECTION'
const NEW_CONNECTION_SUCCESS = 'NEW_CONNECTION_SUCCESS'
const NEW_CONNECTION_FAIL = 'NEW_CONNECTION_FAIL'
const HYDRATE_CONNECTIONS = 'HYDRATE_CONNECTIONS'

const initialState = {
  data: null,
  isFetching: false,
  isPristine: true,
  connectionThemes: {
    default: {
      primary: `rgba(${color.actions.button.primary.rgba})`,
      secondary: `rgba(${color.actions.button.secondary.rgba})`,
    },
  },
  error: {
    code: '',
    message: '',
  },
}

export const updateConnectionTheme = (
  logoUrl,
  primaryColor,
  secondaryColor
) => ({
  type: UPDATE_CONNECTION_THEME,
  logoUrl,
  primaryColor,
  secondaryColor,
})

export const saveNewConnection = connection => ({
  type: NEW_CONNECTION,
  connection,
})

export const saveNewConnectionSuccess = connection => ({
  type: NEW_CONNECTION_SUCCESS,
  connection,
})

export const saveNewConnectionFailed = error => ({
  type: NEW_CONNECTION_FAIL,
  error,
})

export function* loadNewConnectionSaga(action) {
  const {
    identifier,
    remoteConnectionId,
    remoteDID,
  } = action.connection.newConnection
  try {
    let connection = {}

    const agencyUrl = yield select(getAgencyUrl)
    const challenge = JSON.stringify({ remoteConnectionId: remoteDID })
    const signature = yield call(encrypt, remoteConnectionId, challenge)

    try {
      connection = yield call(getProfile, {
        identifier,
        challenge,
        signature,
        agencyUrl,
      })
    } catch (e) {
      console.log(e)
      console.log('get profile call failed for ', identifier)
    }

    Object.assign(connection, {
      identifier,
      logoUrl: connection.logoUrl,
      remoteConnectionId,
      remoteDID,
    })

    //TODO:Add a middleware which will periodically save redux store to secure storage.
    let connections = yield call(getItem, CONNECTIONS)
    connections = connections ? JSON.parse(connections) : {}

    Object.assign(connections, { [identifier]: connectionMapper(connection) })

    yield call(setItem, CONNECTIONS, JSON.stringify(connections))
    yield put(saveNewConnectionSuccess(connection))
  } catch (e) {
    yield put(saveNewConnectionFailed(e))
  }
}

export function* watchNewConnection() {
  yield takeLatest(NEW_CONNECTION, loadNewConnectionSaga)
}

export const hydrateConnections = connections => ({
  type: HYDRATE_CONNECTIONS,
  connections,
})

export const getConnections = connectionsData =>
  connectionsData ? Object.values(connectionsData) : []

export const getConnection = (remoteConnectionId, connections) =>
  Object.values(connections).filter(function(c) {
    return c.remoteConnectionId === remoteConnectionId
  })

export const getConnectionLogo = logoUrl =>
  logoUrl ? { uri: logoUrl } : require('../images/cb_evernym.png')

export default function connections(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONNECTION_THEME:
      return {
        ...state,
        connectionThemes: {
          ...state.connectionThemes,
          [action.logoUrl]: {
            primary: action.primaryColor,
            secondary: action.secondaryColor,
          },
        },
      }
    case NEW_CONNECTION:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
        error: initialState.error,
      }
    case NEW_CONNECTION_SUCCESS:
      const { connection, connection: { identifier } } = action
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          [identifier]: connectionMapper(connection),
        },
      }
    case NEW_CONNECTION_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case HYDRATE_CONNECTIONS:
      return {
        ...state,
        data: action.connections,
      }
    default:
      return state
  }
}

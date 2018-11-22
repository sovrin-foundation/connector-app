// @flow
import {
  put,
  takeLatest,
  takeEvery,
  call,
  select,
  all,
} from 'redux-saga/effects'
import { secureSet, secureDelete, getHydrationItem } from '../services/storage'
import { CONNECTIONS } from '../common'
import {
  getAgencyUrl,
  getAgencyVerificationKey,
  getUserOneTimeInfo,
  getPoolConfig,
  getAllConnection,
  getThemes,
  getConnection as getConnectionBySenderDid,
} from './store-selector'
import { color } from '../common/styles/constant'
import { bubbleSize } from '../common/styles'
import type { CustomError, GenericObject } from '../common/type-common'
import type {
  ConnectionStore,
  Connection,
  Connections,
  ConnectionThemes,
} from './type-connection-store'
import {
  NEW_CONNECTION,
  DELETE_CONNECTION_SUCCESS,
  DELETE_CONNECTION_FAILURE,
  DELETE_CONNECTION,
  STORAGE_KEY_THEMES,
  HYDRATE_CONNECTION_THEMES,
} from './type-connection-store'
import type {
  DeleteConnectionSuccessEventAction,
  DeleteConnectionFailureEventAction,
  DeleteConnectionEventAction,
} from './type-connection-store'
import {
  deleteConnection,
  getHandleBySerializedConnection,
} from '../bridge/react-native-cxs/RNCxs'
import { RESET } from '../common/type-common'
import type { UserOneTimeInfo } from './user/type-user-store'
import { promptBackupBanner } from '../backup/backup-store'
import { HYDRATED } from './type-config-store'
import { captureError } from '../services/error/error-handler'

const UPDATE_CONNECTION_THEME = 'UPDATE_CONNECTION_THEME'
export const NEW_CONNECTION_SUCCESS = 'NEW_CONNECTION_SUCCESS'
export const UPDATE_STATUS_BAR_THEME = 'UPDATE_STATUS_BAR_THEME'
const NEW_CONNECTION_FAIL = 'NEW_CONNECTION_FAIL'
const HYDRATE_CONNECTIONS = 'HYDRATE_CONNECTIONS'

const initialState: ConnectionStore = {
  data: {},
  isFetching: false,
  isPristine: true,
  connectionThemes: {
    default: {
      primary: `rgba(${color.actions.button.primary.rgba})`,
      secondary: `rgba(${color.actions.button.secondary.rgba})`,
    },
  },
  claimMap: null,
  error: {
    code: '',
    message: '',
  },
  hydrated: false,
}

// TODO:KS As of now we have added flow to this file and only checking imports
// but we need to fix all any types. I will do that once claims are done

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  senderName = 'Unknown',
  ...otherArgs
}: GenericObject) => ({
  logoUrl,
  size,
  senderName,
  ...otherArgs,
})

export const updateConnectionTheme = (
  logoUrl: string,
  primaryColor: string,
  secondaryColor: string
) => ({
  type: UPDATE_CONNECTION_THEME,
  logoUrl,
  primaryColor,
  secondaryColor,
})

export const saveNewConnection = (connection: GenericObject) => ({
  type: NEW_CONNECTION,
  connection,
})

export const saveNewConnectionSuccess = (connection: GenericObject) => ({
  type: NEW_CONNECTION_SUCCESS,
  connection,
})

//TODO refactor create a new store for ui
export const updateStatusBarTheme = (statusColor?: string) => ({
  type: UPDATE_STATUS_BAR_THEME,
  color: statusColor || color.bg.tertiary.color,
})

export const saveNewConnectionFailed = (error: CustomError) => ({
  type: NEW_CONNECTION_FAIL,
  error,
})

export const deleteConnectionAction = (
  senderDID: string
): DeleteConnectionEventAction => ({
  type: DELETE_CONNECTION,
  senderDID,
})

export function* deleteConnectionOccurredSaga(
  action: DeleteConnectionEventAction
): Generator<*, *, *> {
  const connections: GenericObject = yield select(getAllConnection)

  const [connection]: Array<Connection> = yield select(
    getConnectionBySenderDid,
    action.senderDID
  )
  const { [connection.myPairwiseDid]: deleted, ...rest } = connections

  const connectionHandle = yield call(
    getHandleBySerializedConnection,
    connection.vcxSerializedConnection
  )

  try {
    yield call(secureSet, CONNECTIONS, JSON.stringify(rest))
    yield put(deleteConnectionSuccess(rest))
    yield call(deleteConnection, connectionHandle)
  } catch (e) {
    captureError(e)
    yield put(deleteConnectionFailure(connection, e))
  }
}

export function* watchDeleteConnectionOccurred(): any {
  yield takeLatest(DELETE_CONNECTION, deleteConnectionOccurredSaga)
}

export function* loadNewConnectionSaga(
  action: GenericObject
): Generator<*, *, *> {
  const {
    identifier,
    logoUrl,
    senderDID,
    senderEndpoint,
    senderName,
    myPairwiseDid,
    myPairwiseVerKey,
    myPairwiseAgentDid,
    myPairwiseAgentVerKey,
    myPairwisePeerVerKey,
    vcxSerializedConnection,
  }: Connection = action.connection.newConnection

  try {
    const connection = {
      identifier,
      logoUrl,
      senderDID,
      senderEndpoint,
      senderName,
      myPairwiseDid,
      myPairwiseVerKey,
      myPairwiseAgentDid,
      myPairwiseAgentVerKey,
      myPairwisePeerVerKey,
      vcxSerializedConnection,
    }

    yield put(promptBackupBanner(true))
    yield put(saveNewConnectionSuccess(connection))
    yield* persistConnections()
  } catch (e) {
    yield put(saveNewConnectionFailed(e))
  }
}

export function* watchNewConnection(): any {
  yield takeEvery(NEW_CONNECTION, loadNewConnectionSaga)
}

export function* persistConnections(): Generator<*, *, *> {
  try {
    const connections = yield select(getAllConnection)
    yield call(secureSet, CONNECTIONS, JSON.stringify(connections))
  } catch (e) {
    captureError(e)
    console.log(`hydrateConnectionSaga: ${e}`)
  }
}

export const hydrateConnections = (connections: Connections) => ({
  type: HYDRATE_CONNECTIONS,
  connections,
})

export function* hydrateConnectionSaga(): Generator<*, *, *> {
  try {
    const connections = yield call(getHydrationItem, CONNECTIONS)
    if (connections) {
      yield put(hydrateConnections(JSON.parse(connections)))
    }
  } catch (e) {
    // to capture secure get
    captureError(e)
    console.log(`hydrateConnectionSaga: ${e}`)
  }
}

export const getConnections = (connectionsData: ?Connections) =>
  connectionsData ? Object.values(connectionsData) : []

export const getConnection = (
  remoteConnectionId: string,
  connections: Connections
) =>
  Object.values(connections).filter(function(c: any) {
    return c.remoteConnectionId === remoteConnectionId
  })

export const getConnectionLogo = (logoUrl: ?string) =>
  logoUrl ? { uri: logoUrl } : require('../images/logo_sovrin.png')

export const deleteConnectionSuccess = (
  filteredConnections: Connections
): DeleteConnectionSuccessEventAction => ({
  type: DELETE_CONNECTION_SUCCESS,
  filteredConnections,
})

export const deleteConnectionFailure = (
  connection: Connection,
  error: CustomError
): DeleteConnectionFailureEventAction => ({
  type: DELETE_CONNECTION_FAILURE,
  connection,
  error,
})

export const hydrateConnectionThemes = (themes: ConnectionThemes) => ({
  type: HYDRATE_CONNECTION_THEMES,
  themes,
})

export function* persistThemes(): Generator<*, *, *> {
  const themes = yield select(getThemes)
  try {
    yield call(secureSet, STORAGE_KEY_THEMES, JSON.stringify(themes))
  } catch (e) {
    // capture error for secure set
    captureError(e)
    console.error(`persistThemes: ${e}`)
  }
}

export function* hydrateThemes(): Generator<*, *, *> {
  try {
    const themes = yield call(getHydrationItem, STORAGE_KEY_THEMES)
    if (themes) {
      yield put(hydrateConnectionThemes(JSON.parse(themes)))
    }
  } catch (e) {
    // capture error for secure get
    captureError(e)
    console.error(`hydrateThemes: ${e}`)
  }
}

export function* removePersistedThemes(): Generator<*, *, *> {
  try {
    yield call(secureDelete, STORAGE_KEY_THEMES)
  } catch (e) {
    // capture error for secure delete
    captureError(e)
    console.error(`removePersistedThemes: ${e}`)
  }
}

export function* watchUpdateConnectionTheme(): any {
  yield takeLatest(UPDATE_CONNECTION_THEME, persistThemes)
}

export function* watchConnection(): any {
  yield all([
    watchDeleteConnectionOccurred(),
    watchNewConnection(),
    watchUpdateConnectionTheme(),
  ])
}

export default function connections(
  state: ConnectionStore = initialState,
  action: any
) {
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
    case HYDRATE_CONNECTION_THEMES:
      return {
        ...state,
        connectionThemes: {
          ...state.connectionThemes,
          ...action.themes,
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
    case DELETE_CONNECTION_SUCCESS:
      const filteredData = { ...action.filteredConnections }
      return {
        ...state,
        data: filteredData,
      }
    case UPDATE_STATUS_BAR_THEME:
      return {
        ...state,
        statusBarTheme: action.color,
      }
    case HYDRATE_CONNECTIONS:
      return {
        ...state,
        data: action.connections,
      }
    case HYDRATED:
      return {
        ...state,
        hydrated: true,
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

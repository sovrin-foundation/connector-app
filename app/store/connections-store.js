// $FlowFixMe
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { setItem, getItem } from '../services/secure-storage'
import { CONNECTIONS } from '../common'
import { getAgencyUrl } from './store-selector'
import { color } from '../common/styles/constant'
import { bubbleSize } from '../common/styles'
import type { CustomError, GenericObject } from '../common/type-common'
import type {
  ConnectionStore,
  Connection,
  Connections,
} from './type-connection-store'
import {
  NEW_CONNECTION,
  DELETE_CONNECTION_SUCCESS,
  DELETE_CONNECTION_FAILURE,
} from './type-connection-store'
import type {
  DeleteConnectionSuccessEventAction,
  DeleteConnectionFailureEventAction,
} from './type-connection-store'
const UPDATE_CONNECTION_THEME = 'UPDATE_CONNECTION_THEME'
export const NEW_CONNECTION_SUCCESS = 'NEW_CONNECTION_SUCCESS'
const NEW_CONNECTION_FAIL = 'NEW_CONNECTION_FAIL'
const HYDRATE_CONNECTIONS = 'HYDRATE_CONNECTIONS'

const initialState: ConnectionStore = {
  data: null,
  isFetching: false,
  isPristine: true,
  connectionThemes: {
    default: {
      primary: `rgba(${color.actions.button.primary.rgba})`,
      secondary: `rgba(${color.actions.button.secondary.rgba})`,
    },
    active: {
      primary: `rgba(${color.actions.button.primary.rgba})`,
      secondary: `rgba(${color.actions.button.secondary.rgba})`,
    },
  },
  claimMap: null,
  error: {
    code: '',
    message: '',
  },
}

// TODO:KS As of now we have added flow to this file and only checking imports
// but we need to fix all any types. I will do that once claims are done

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  senderName = 'Evernym',
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

export const saveNewConnectionFailed = (error: CustomError) => ({
  type: NEW_CONNECTION_FAIL,
  error,
})

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
    }

    //TODO:Add a middleware which will periodically save redux store to secure storage.
    let connections = yield call(getItem, CONNECTIONS)
    connections = connections ? JSON.parse(connections) : {}

    Object.assign(connections, {
      [identifier]: connectionMapper(connection),
    })

    yield call(setItem, CONNECTIONS, JSON.stringify(connections))
    yield put(saveNewConnectionSuccess(connection))
  } catch (e) {
    yield put(saveNewConnectionFailed(e))
  }
}

export function* watchNewConnection(): Generator<*, *, *> {
  yield takeLatest(NEW_CONNECTION, loadNewConnectionSaga)
}

export const hydrateConnections = (connections: Connections) => ({
  type: HYDRATE_CONNECTIONS,
  connections,
})

export const getConnections = (connectionsData: Array<Connection>) =>
  connectionsData ? Object.values(connectionsData) : []

export const getConnection = (
  remoteConnectionId: string,
  connections: Array<Connection>
) =>
  Object.values(connections).filter(function(c: any) {
    return c.remoteConnectionId === remoteConnectionId
  })

export const getConnectionLogo = (logoUrl: ?string) =>
  logoUrl ? { uri: logoUrl } : require('../images/cb_evernym.png')

//TODO : fix filteredConnections type
export const deleteConnectionSuccess = (
  filteredConnections: GenericObject
): DeleteConnectionSuccessEventAction => ({
  type: DELETE_CONNECTION_SUCCESS,
  filteredConnections,
})

//TODO : fix connections type
export const deleteConnectionFailure = (
  connections: GenericObject,
  error: CustomError
): DeleteConnectionFailureEventAction => ({
  type: DELETE_CONNECTION_FAILURE,
  connections,
  error,
})

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
          active: {
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
    case DELETE_CONNECTION_SUCCESS:
      const filteredData = { ...action.filteredConnections }
      return {
        ...state,
        data: filteredData,
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

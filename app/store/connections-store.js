// $FlowFixMe
import { put, takeLatest, call, select } from 'redux-saga/effects'
import { setItem, getItem } from '../services/secure-storage'
import { CONNECTIONS } from '../common'
import {
  getAgencyUrl,
  getAgencyVerificationKey,
  getUserOneTimeInfo,
  getPoolConfig,
  getAllConnection,
} from './store-selector'
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
  DELETE_CONNECTION,
} from './type-connection-store'
import type {
  DeleteConnectionSuccessEventAction,
  DeleteConnectionFailureEventAction,
  DeleteConnectionEventAction,
} from './type-connection-store'
import { deleteConnection } from '../bridge/react-native-cxs/RNCxs'

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

export const deleteConnectionAction = (
  senderDID: string
): DeleteConnectionEventAction => ({
  type: DELETE_CONNECTION,
  senderDID,
})

export function* deleteConnectionOccurredSaga(
  action: DeleteConnectionEventAction
): Generator<*, *, *> {
  const userOneTimeInfo: UserOneTimeInfo = yield select(getUserOneTimeInfo)
  const agencyVerificationKey: string = yield select(getAgencyVerificationKey)
  const agencyUrl: string = yield select(getAgencyUrl)
  const poolConfig: string = yield select(getPoolConfig)
  const connections: GenericObject = yield select(getAllConnection)

  //TODO : move this logic to selector
  const savedConnections: Array<Connection> = Object.values(connections)
  const connection = savedConnections.filter(
    connection => connection.senderDID === action.senderDID
  )[0]
  const { [connection.myPairwiseDid]: deleted, ...rest } = connections

  const url = `${agencyUrl}/agency/msg`
  try {
    yield call(deleteConnection, {
      url,
      myPairwiseDid: connection.myPairwiseDid,
      myPairwiseVerKey: connection.myPairwiseVerKey,
      myPairwiseAgentDid: connection.myPairwiseAgentDid,
      myPairwiseAgentVerKey: connection.myPairwiseAgentVerKey,
      myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
      myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
      myOneTimeDid: userOneTimeInfo.myOneTimeDid,
      myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
      myAgencyVerKey: agencyVerificationKey,
      poolConfig,
    })
    let connections = yield call(getItem, CONNECTIONS)
    connections = connections ? JSON.parse(connections) : {}

    yield call(setItem, CONNECTIONS, JSON.stringify(rest))
    yield put(deleteConnectionSuccess(rest))
  } catch (e) {
    yield put(deleteConnectionFailure(action.connection, e))
  }
}

export function* watchDeleteConnectionOccurred(): Generator<*, *, *> {
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

export const getConnections = (connectionsData: Connections) =>
  connectionsData ? Object.values(connectionsData) : []

export const getConnection = (
  remoteConnectionId: string,
  connections: Connections
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

// @flow
import renderer from 'react-test-renderer'
import * as matchers from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'

import connectionReducer, {
  saveNewConnection,
  saveNewConnectionSuccess,
  saveNewConnectionFailed,
  connectionMapper,
  deleteConnectionSuccess,
  deleteConnectionOccurredSaga,
  deleteConnectionAction,
  persistThemes,
  hydrateThemes,
  removePersistedThemes,
  hydrateConnectionThemes,
} from '../connections-store'
import { bubbleSize } from '../../common/styles'
import {
  successConnectionData,
  connections,
  userOneTimeInfo,
  configStoreNotHydratedInstalledVcxInit,
  getStore,
  connectionThemes,
} from '../../../__mocks__/static-data'
import { safeGet, safeSet, secureSet, secureGet } from '../../services/storage'
import { CONNECTIONS } from '../../common'
import { deleteConnection } from '../../bridge/react-native-cxs/RNCxs'
import { STORAGE_KEY_THEMES } from '../type-connection-store'

describe('Mapper', () => {
  it('connectionMapper should return proper object', () => {
    const connection = {
      identifier: '3nj819kkjywdppuje79',
      logoUrl: 'https://test-agengy.com/logo',
      size: bubbleSize.XL,
      name: 'test',
      senderDID: '123819kkjywdppuj987',
      senderEndpoint: 'https://test-endpoint.com',
      remoteConnectionId: '5iZiu2aLYrQXSdon123456',
    }
    const tree = connectionMapper(connection)
    expect(tree).toMatchSnapshot()
  })
})

describe('connections should update correctly', () => {
  let initialState = {
    data: null,
  }
  const newConnection = {
    identifier: '6789012345678906789012',
    name: 'test',
  }

  beforeAll(() => {
    // get initial state without any action
    initialState = connectionReducer(undefined, { type: 'NO_ACTION' })
  })

  it('should receive new connection request', () => {
    const expectedState = {
      ...initialState,
      isFetching: true,
      isPristine: false,
    }
    const actualState = connectionReducer(
      initialState,
      saveNewConnection(newConnection)
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('match delete connection success', () => {
    expect(
      connectionReducer(initialState, deleteConnectionSuccess(connections))
    ).toMatchSnapshot()
  })

  it('saga:deleteConnectionOccurredSaga, success', () => {
    const connection = successConnectionData.newConnection
    const stateWithConnection = {
      connections: {
        data: {
          [connection.identifier]: connection,
        },
      },
      user: {
        userOneTimeInfo,
      },
      config: configStoreNotHydratedInstalledVcxInit,
    }

    return expectSaga(
      deleteConnectionOccurredSaga,
      deleteConnectionAction(connection.senderDID)
    )
      .withState(stateWithConnection)
      .provide([
        [matchers.call.like({ fn: deleteConnection }), true],
        [matchers.call.fn(secureSet, CONNECTIONS, '{}'), true],
      ])
      .call.like({ fn: deleteConnection })
      .call(secureSet, CONNECTIONS, '{}')
      .put(deleteConnectionSuccess({}))
      .run()
  })

  it('should update connections and store new connection properly', () => {
    const expectedState = {
      ...initialState,
      isFetching: false,
      data: {
        ...initialState.data,
        [newConnection.identifier]: newConnection,
      },
    }
    const actualState = connectionReducer(
      initialState,
      saveNewConnectionSuccess(newConnection)
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should fail if new connection is not stored', () => {
    const error = { code: '1234', message: 'new connection failed' },
      expectedState = {
        ...initialState,
        isFetching: false,
        error,
      }
    const actualState = connectionReducer(
      initialState,
      saveNewConnectionFailed(error)
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should reset connection store, if RESET action is raised', () => {
    const afterNewConnection = connectionReducer(
      initialState,
      saveNewConnection(newConnection)
    )
    expect(
      connectionReducer(afterNewConnection, { type: 'RESET' })
    ).toMatchSnapshot()
  })

  it('saga:persistThemes, success', async () => {
    const stateWithThemes = getStore().getState()
    const result = await expectSaga(persistThemes)
      .withState(stateWithThemes)
      .provide([[matchers.call.like({ fn: secureSet }), true]])
      .run()
    expect(result).toMatchSnapshot()
  })

  it('saga:hydrateThemes, success', async () => {
    const result = await expectSaga(hydrateThemes)
      .provide([
        [
          matchers.call.fn(secureGet, STORAGE_KEY_THEMES),
          JSON.stringify(connectionThemes),
        ],
      ])
      .run()
    expect(result).toMatchSnapshot()
  })

  it('saga:removePersistedThemes, success', async () => {
    const result = await expectSaga(removePersistedThemes).run()
    expect(result).toMatchSnapshot()
  })

  it('ACTION:HYDRATE_CONNECTION_THEMES', () => {
    const afterThemeHydrationState = connectionReducer(
      initialState,
      hydrateConnectionThemes(connectionThemes)
    )
    expect(afterThemeHydrationState).toMatchSnapshot()
  })
})

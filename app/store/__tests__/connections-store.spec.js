import 'react-native'
import renderer from 'react-test-renderer'

import connectionReducer, {
  saveNewConnection,
  saveNewConnectionSuccess,
  saveNewConnectionFailed,
  connectionMapper,
  deleteConnectionSuccess,
} from '../connections-store'
import { bubbleSize } from '../../common/styles'
import {
  successConnectionData,
  connections,
} from '../../../__mocks__/static-data'

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
  let initialState = {}
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

  //TODO fix test
  xit('deleteConnectionOccurredSaga should raise success for deleting connection', () => {})

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
})

import 'react-native'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

import connectionReducer, {
  saveNewConnection,
  saveNewConnectionSuccess,
  saveNewConnectionFailed,
} from '../connections-store'

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

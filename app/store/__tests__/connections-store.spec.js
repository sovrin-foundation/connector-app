import 'react-native'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

import connectionReducer, {
  getConnections,
  getConnectionsFailed,
  getConnectionsSuccess,
} from '../connections-store'

describe('connections should update correctly', () => {
  let initialState = {}

  beforeAll(() => {
    // get initial state without any action
    initialState = connectionReducer(undefined, { type: 'NOACTION' })
  })

  it('should reflect get connections request started', () => {
    const expectedState = {
      ...initialState,
      isFetching: true,
      isPristine: false,
    }
    const actualState = connectionReducer(initialState, getConnections())

    expect(actualState).toMatchObject(expectedState)
  })

  it('should reflect connections received', () => {
    const data = { did1: { name: 'Connection 1 name' } }
    const expectedState = { ...initialState, data }
    const actualState = connectionReducer(
      initialState,
      getConnectionsSuccess(data)
    )

    expect(actualState).toMatchObject(expectedState)
  })

  it('should reflect get connections failed', () => {
    const error = { code: '1234', message: 'connections fetch failed' }
    const expectedState = {
      ...initialState,
      error,
    }
    const actualState = connectionReducer(
      initialState,
      getConnectionsFailed(error)
    )

    expect(actualState).toMatchObject(expectedState)
  })
})

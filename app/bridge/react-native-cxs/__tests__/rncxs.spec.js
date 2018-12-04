// @flow
import { NativeModules } from 'react-native'
import { getHandleBySerializedConnection } from '../RNCxs'
import { vcxConnectionSerialized } from '../../../../__mocks__/data/vcx-mock-data'

describe('RNCxs', () => {
  function setup() {
    const connectionHandle = 1
    const mockGetHandleBySerializedConnection =
      NativeModules.RNIndy.deserializeConnection

    return { connectionHandle, mockGetHandleBySerializedConnection }
  }

  it('fn:deserializeConnection, two calls for two different string', async () => {
    const { connectionHandle, mockGetHandleBySerializedConnection } = setup()
    const vcxConnectionHandle = await getHandleBySerializedConnection(
      vcxConnectionSerialized
    )
    expect(vcxConnectionHandle).toBe(connectionHandle)

    await getHandleBySerializedConnection('{someOtherSerializedState}')
    expect(
      mockGetHandleBySerializedConnection.mock.calls.length
    ).toBeGreaterThanOrEqual(2)

    mockGetHandleBySerializedConnection.mockReset()
    mockGetHandleBySerializedConnection.mockRestore()
  })

  it('fn:deserializeConnection, one call for same string, multiple calls', async () => {
    const serializedConnection = '{serializedConnectionForThisTestOnly}'
    const { connectionHandle, mockGetHandleBySerializedConnection } = setup()
    await getHandleBySerializedConnection(serializedConnection)
    await getHandleBySerializedConnection(serializedConnection)
    expect(mockGetHandleBySerializedConnection.mock.calls.length).toBe(1)

    mockGetHandleBySerializedConnection.mockReset()
    mockGetHandleBySerializedConnection.mockRestore()
  })
})

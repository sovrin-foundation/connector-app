import hydrationReducer, {
  hydrateApp,
  hydrateAppSuccess,
  hydrateAppFail,
} from '../hydration-store'
import connectionsReducer, {
  hydrateConnections,
} from '../../store/connections-store'
import pushNotificationReducer, {
  updatePushToken,
} from '../../store/push-notification-store'

describe('hydration store should update dependant store correctly', () => {
  let initialState = (initialConnectionsState = initialPushNotificationState = {})

  beforeAll(() => {
    initialState = hydrationReducer(undefined, { type: 'NO_ACTION' })
    initialConnectionsState = connectionsReducer(undefined, {
      type: 'NO_ACTION',
    })
    initialPushNotificationState = pushNotificationReducer(undefined, {
      type: 'NO_ACTION',
    })
  })

  it('should send hydrate app request properly', () => {
    const expectedState = {
      ...initialState,
      isFetching: true,
      isPristine: false,
    }

    const actualState = hydrationReducer(initialState, hydrateApp())
    expect(actualState).toMatchObject(expectedState)
  })

  it('should update connections and pushToken store properly', () => {
    const data = {
      '1234567890098765432112': {
        identifier: '1234567890098765432112',
        name: 'test',
        logoUrl: 'testLogoUrl',
        remoteConnectionId: 'asdfghjkl1234567890098',
      },
    }
    const expectedConnectionsState = {
      ...initialConnectionsState,
      data,
      isFetching: false,
    }
    const actualConnectionsState = connectionsReducer(
      initialConnectionsState,
      hydrateConnections(data)
    )
    expect(actualConnectionsState).toMatchObject(expectedConnectionsState)

    const pushToken = 'test:APA91bFOyY3at1DzdKO-Z4G_5dG12cXvKC1GuI…CX3jH'
    const expectedPushNotificationState = {
      ...initialPushNotificationState,
      pushToken,
    }
    const actualPushNotificationState = pushNotificationReducer(
      initialPushNotificationState,
      updatePushToken(pushToken)
    )

    expect(actualPushNotificationState).toMatchObject(
      expectedPushNotificationState
    )

    const expectedState = {
      ...initialState,
      isFetching: false,
    }
    const actualState = hydrationReducer(initialState, hydrateAppSuccess(data))
    expect(actualState).toMatchObject(expectedState)
  })

  it('should fail if encounter error', () => {
    const error = {
      code: 'OCS',
      message: 'hydrate app error',
    }
    const expectedState = {
      ...initialState,
      error,
      isFetching: false,
    }

    const actualState = hydrationReducer(initialState, hydrateAppFail(error))
    expect(actualState).toMatchObject(expectedState)
  })
})

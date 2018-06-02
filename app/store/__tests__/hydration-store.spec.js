// @flow
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
} from '../../push-notification/push-notification-store'
import { initialTestAction } from '../../common/type-common'
import {
  successConnectionData,
  vcxSerializedConnection,
} from '../../../__mocks__/static-data'

describe('hydration store should update dependant store correctly', () => {
  function setup() {
    return {
      initialState: hydrationReducer(undefined, initialTestAction()),
      initialConnectionsState: connectionsReducer(
        undefined,
        initialTestAction()
      ),
      initialPushNotificationState: pushNotificationReducer(
        undefined,
        initialTestAction()
      ),
    }
  }

  it('should send hydrate app request properly', () => {
    const { initialState } = setup()
    const expectedState = {
      ...initialState,
      isFetching: true,
      isPristine: false,
    }

    const actualState = hydrationReducer(initialState, hydrateApp(false))
    expect(actualState).toMatchObject(expectedState)
  })

  it('should update connections and pushToken store properly', () => {
    const {
      initialState,
      initialConnectionsState,
      initialPushNotificationState,
    } = setup()

    const data = {
      '1234567890098765432112': {
        ...successConnectionData.newConnection,
        vcxSerializedConnection,
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
    const actualState = hydrationReducer(initialState, hydrateAppSuccess())
    expect(actualState).toMatchObject(expectedState)
  })

  it('should fail if encounter error', () => {
    const { initialState } = setup()
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

import { call, select } from 'redux-saga/effects'
import { getAgencyUrl, getAllConnection } from '../store-selector'
import pushNotificationReducer, {
  pushNotificationPermissionAction,
  pushNotificationReceived,
  updatePushToken,
  onPushTokenUpdate,
} from '../push-notification-store'

describe('push notification store should work properly', () => {
  let initialState = {}
  beforeAll(() => {
    initialState = pushNotificationReducer(undefined, { type: 'NOACTION' })
  })

  it('should set push notification permission accepted', () => {
    const expectedState = {
      ...initialState,
      isAllowed: true,
      notification: null,
    }
    const actualState = pushNotificationReducer(
      initialState,
      pushNotificationPermissionAction(true)
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should set new push notification flag true', () => {
    const expectedState = {
      ...initialState,
      isAllowed: false,
      notification: { type: 'auth-req' },
    }
    const actualState = pushNotificationReducer(
      initialState,
      pushNotificationReceived({ type: 'auth-req' })
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should update push token properly', () => {
    const pushToken = 'test:APA91bFOyY3at1DzdKO-Z4G_5dG12cXvKC1GuI…CX3jH'
    const expectedState = {
      ...initialState,
      pushToken,
    }
    const actualState = pushNotificationReducer(
      initialState,
      updatePushToken(pushToken)
    )
    expect(actualState).toMatchObject(expectedState)
  })

  it('should send updated push token for each connection', () => {
    const pushToken = 'test:APA91bFOyY3at1DzdKO-Z4G_5dG12cXvKC1GuICX3jH'
    const gen = onPushTokenUpdate(updatePushToken(pushToken))
    expect(gen.next().value).toMatchObject(select(getAgencyUrl))
    const agencyUrl = 'https://agencyurl.com'

    expect(gen.next(agencyUrl).value).toMatchObject(select(getAllConnection))
    const connections = {
      '3KEhz3HjghBmeiTpX4aN4n': {
        identifier: '3KEhz3HjghBmeiTpX4aN4n',
        logoUrl: 'https://agent.com/agent/profile/logo',
        name: 'Test',
        remoteConnectionId: 'XENwK1yyikGG9iMMutnsjB',
        remoteDID: 'B4Y9fhpeHdGHBKKtSgAYrB',
        seed: '4g33i88Gd1jfKhhci611SNximzeFh61S',
      },
      '3KEhz3HjghBmeiTpX4aN44': {
        identifier: '3KEhz3HjghBmeiTpX4aN44',
        logoUrl: 'https://agent.com/agent/profile/logo',
        name: 'Test',
        remoteConnectionId: 'XENwK1yyikGG9iMMutnsjC',
        remoteDID: 'B4Y9fhpeHdGHBKKtSgAYrB',
        seed: '4g33i88Gd1jfKhhci611SNximzeFh61Z',
      },
    }

    const apiCall = gen.next(connections).value
    const challenge = JSON.stringify({ pushComMethod: `FCM:${pushToken}` })
    expect(apiCall['CALL'].args[0]).toMatchObject(
      expect.objectContaining({
        agencyUrl,
        signature: expect.any(String),
        challenge,
        DID: '3KEhz3HjghBmeiTpX4aN4n',
      })
    )

    const nextApiCall = gen.next().value
    expect(nextApiCall['CALL'].args[0]).toMatchObject(
      expect.objectContaining({
        agencyUrl,
        signature: expect.any(String),
        challenge,
        DID: '3KEhz3HjghBmeiTpX4aN44',
      })
    )

    expect(gen.next().done).toBe(true)
  })
})

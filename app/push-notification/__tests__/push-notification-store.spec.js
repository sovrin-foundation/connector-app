import { call, select } from 'redux-saga/effects'
import { getAgencyUrl, getAllConnection } from '../../store/store-selector'
import pushNotificationReducer, {
  pushNotificationPermissionAction,
  pushNotificationReceived,
  updatePushToken,
  onPushTokenUpdate,
} from '../push-notification-store'
import { encrypt } from '../../bridge/react-native-cxs/RNCxs'
import { sendUpdatedPushToken, PAYLOAD_TYPE } from '../../services'

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
    const DID1 = '3KEhz3HjghBmeiTpX4aN4n'
    const DID2 = '3KEhz3HjghBmeiTpX4aN44'
    const connections = {
      [DID1]: {
        identifier: '3KEhz3HjghBmeiTpX4aN4n',
        logoUrl: 'https://agent.com/agent/profile/logo',
        name: 'Test',
        remoteConnectionId: 'XENwK1yyikGG9iMMutnsjB',
        remoteDID: 'B4Y9fhpeHdGHBKKtSgAYrB',
        seed: '4g33i88Gd1jfKhhci611SNximzeFh61S',
      },
      [DID2]: {
        identifier: '3KEhz3HjghBmeiTpX4aN44',
        logoUrl: 'https://agent.com/agent/profile/logo',
        name: 'Test',
        remoteConnectionId: 'XENwK1yyikGG9iMMutnsjC',
        remoteDID: 'B4Y9fhpeHdGHBKKtSgAYrB',
        seed: '4g33i88Gd1jfKhhci611SNximzeFh61Z',
      },
    }

    const dataBody = {
      to: DID1,
      agentPayload: JSON.stringify({
        type: PAYLOAD_TYPE.UPDATE_PUSH_COM_METHOD,
        pushComMethod: `FCM:${pushToken}`,
      }),
    }

    expect(gen.next(connections).value).toMatchObject(
      call(sendUpdatedPushToken, {
        agencyUrl,
        dataBody,
      })
    )

    const dataBody2 = {
      to: DID2,
      agentPayload: JSON.stringify({
        type: PAYLOAD_TYPE.UPDATE_PUSH_COM_METHOD,
        pushComMethod: `FCM:${pushToken}`,
      }),
    }

    expect(gen.next(connections).value).toMatchObject(
      call(sendUpdatedPushToken, {
        agencyUrl,
        dataBody: dataBody2,
      })
    )

    expect(gen.next().done).toBe(true)
  })
})

import { call, select, take } from 'redux-saga/effects'
import {
  getAgencyUrl,
  getAgencyVerificationKey,
  getHydrationState,
  getUserOneTimeInfo,
} from '../../store/store-selector'
import pushNotificationReducer, {
  pushNotificationPermissionAction,
  pushNotificationReceived,
  updatePushToken,
  onPushTokenUpdate,
} from '../push-notification-store'
import { updatePushToken as updatePushTokenApi } from '../../bridge/react-native-cxs/RNCxs'
import { PAYLOAD_TYPE } from '../../api/api-constants'
import { userOneTimeInfo } from '../../../__mocks__/static-data'
import { CONNECT_REGISTER_CREATE_AGENT_DONE } from '../../store/user/type-user-store'

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
    expect(gen.next(agencyUrl).value).toEqual(select(getHydrationState))

    const hydrationState = true
    expect(gen.next(hydrationState).value).toEqual(select(getUserOneTimeInfo))

    expect(gen.next().value).toMatchObject(
      take(CONNECT_REGISTER_CREATE_AGENT_DONE)
    )

    expect(gen.next({ userOneTimeInfo }).value).toEqual(
      select(getAgencyVerificationKey)
    )

    const agencyVerificationKey = 'agencyVerificationKey'
    expect(gen.next(agencyVerificationKey).value).toEqual(
      call(updatePushTokenApi, {
        url: `${agencyUrl}/agency/msg`,
        token: `FCM:${pushToken}`,
        myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
        myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
        myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
        myAgencyVerKey: agencyVerificationKey,
      })
    )

    expect(gen.next().done).toBe(true)
  })
})

import pushNotificationReducer, {
  pushNotificationPermissionAction,
  pushNotificationReceived,
} from '../push-notification-store'

describe('push notification store should work properly', () => {
  let initialState = {}
  beforeAll(() => {
    initialState = pushNotificationReducer(undefined, { type: 'NOACTION' })
  })

  it('should set push notification permission accepted', () => {
    const expectedState = {
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
      isAllowed: false,
      notification: { type: 'auth-req' },
    }
    const actualState = pushNotificationReducer(
      initialState,
      pushNotificationReceived({ type: 'auth-req' })
    )
    expect(actualState).toMatchObject(expectedState)
  })
})

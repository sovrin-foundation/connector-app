import routeReducer, { handleRouteUpdate } from '../route-store'
import { invitationRoute } from '../../common/route-constants'

describe('route should update properly', () => {
  let initialState = {}
  beforeAll(() => {
    initialState = routeReducer(undefined, { type: 'NO_ACTION' })
  })

  it('should update current screen route', () => {
    const expectedState = {
      currentScreen: invitationRoute,
    }
    const actualState = routeReducer(
      initialState,
      handleRouteUpdate(invitationRoute)
    )
    expect(actualState).toMatchObject(expectedState)
  })
})

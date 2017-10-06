import routeReducer, { handleRouteUpdate } from '../route-store'
import { authenticationRoute } from '../../common/route-constants'

describe('route should update properly', () => {
  let initialState = {}
  beforeAll(() => {
    initialState = routeReducer(undefined, { type: 'NO_ACTION' })
  })

  it('should update current screen route', () => {
    const expectedState = {
      currentScreen: authenticationRoute,
    }
    const actualState = routeReducer(
      initialState,
      handleRouteUpdate(authenticationRoute)
    )
    expect(actualState).toMatchObject(expectedState)
  })
})

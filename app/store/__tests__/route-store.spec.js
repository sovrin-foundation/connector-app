// @flow
import routeReducer, { handleRouteUpdate } from '../route-store'
import { authenticationRoute } from '../../common/route-constants'
import { initialTestAction } from '../../common/type-common'

describe('route should update properly', () => {
  function setup() {
    return {
      initialState: routeReducer(undefined, initialTestAction()),
    }
  }

  it('should update current screen route', () => {
    const { initialState } = setup()
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

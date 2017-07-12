import { splashScreenRoute } from '../common/route-constants'

const initialState = {
  currentScreen: splashScreenRoute,
}

export const ROUTE_UPDATE = 'ROUTE_UPDATE'

export const handleRouteUpdate = currentScreen => ({
  type: ROUTE_UPDATE,
  currentScreen,
})

export default function routeReducer(state = initialState, action) {
  switch (action.type) {
    case ROUTE_UPDATE:
      return {
        currentScreen: action.currentScreen,
      }
    default:
      return state
  }
}

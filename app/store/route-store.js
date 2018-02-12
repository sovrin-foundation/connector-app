// @flow
import { splashScreenRoute } from '../common/route-constants'
import type { RouteStore } from './type-store'

export type RouteStoreAction = typeof handleRouteUpdate

const initialState = {
  currentScreen: splashScreenRoute,
}

export const ROUTE_UPDATE = 'ROUTE_UPDATE'

export const handleRouteUpdate = (currentScreen: string) => ({
  type: ROUTE_UPDATE,
  currentScreen,
})

export default function routeReducer(
  state: RouteStore = initialState,
  action: RouteStoreAction
) {
  switch (action.type) {
    case ROUTE_UPDATE:
      return {
        currentScreen: action.currentScreen,
      }
    default:
      return state
  }
}

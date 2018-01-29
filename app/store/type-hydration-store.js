// @flow
import type { CustomError, InitialTestAction } from '../common/type-common'

export const hydrationInitialState = {
  error: {
    code: '',
    message: '',
  },
  isFetching: false,
  isPristine: true,
}

export type HydrationStore = typeof hydrationInitialState

export const HYDRATE_APP = 'HYDRATE_APP'
export type HydrateAppAction = {
  type: typeof HYDRATE_APP,
  isAlreadyInstalled: boolean,
}

export const HYDRATE_APP_SUCCESS = 'HYDRATE_APP_SUCCESS'
export type HydrateAppSuccessAction = {
  type: typeof HYDRATE_APP_SUCCESS,
}

export const HYDRATE_APP_FAIL = 'HYDRATE_APP_FAIL'
export type HydrateAppFailAction = {
  type: typeof HYDRATE_APP_FAIL,
  error: CustomError,
}

export type HydrationStoreAction =
  | InitialTestAction
  | HydrateAppAction
  | HydrateAppSuccessAction
  | HydrateAppFailAction

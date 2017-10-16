// @flow
import {
  DEEP_LINK_DATA,
  DEEP_LINK_EMPTY,
  DEEP_LINK_ERROR,
} from './type-deep-link'
import type {
  DeepLinkStore,
  DeepLinkAction,
  DeepLinkDataAction,
  DeepLinkEmptyAction,
  DeepLinkErrorAction,
} from './type-deep-link'

const initialState = {
  token: null,
  isLoading: true,
  error: null,
}

// action creators
export const deepLinkData = (data: string): DeepLinkDataAction => ({
  type: DEEP_LINK_DATA,
  data,
})

export const deepLinkEmpty = (): DeepLinkEmptyAction => ({
  type: DEEP_LINK_EMPTY,
})

export const deepLinkError = (error: any): DeepLinkErrorAction => ({
  type: DEEP_LINK_DATA,
  error,
})

export default function deepLinkReducer(
  state: DeepLinkStore = initialState,
  action: DeepLinkAction
) {
  switch (action.type) {
    case DEEP_LINK_DATA:
      return {
        ...state,
        isLoading: false,
        token: action.data,
        error: null,
      }
    case DEEP_LINK_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }
    case DEEP_LINK_EMPTY:
      return {
        ...state,
        isLoading: false,
        token: null,
        error: null,
      }
    default:
      return state
  }
}

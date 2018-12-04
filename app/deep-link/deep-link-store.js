// @flow
import {
  DEEP_LINK_DATA,
  DEEP_LINK_EMPTY,
  DEEP_LINK_PROCESSED,
  DEEP_LINK_ERROR,
  DEEP_LINK_STATUS,
} from './type-deep-link'
import type {
  DeepLinkStore,
  DeepLinkAction,
  DeepLinkDataAction,
  DeepLinkProcessedAction,
  DeepLinkEmptyAction,
  DeepLinkErrorAction,
} from './type-deep-link'
import { RESET } from '../common/type-common'

const initialState = {
  tokens: {},
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

export const deepLinkError = (error: string): DeepLinkErrorAction => ({
  type: DEEP_LINK_ERROR,
  error,
})

export const deepLinkProcessed = (data: string): DeepLinkProcessedAction => ({
  type: DEEP_LINK_PROCESSED,
  data,
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
        tokens: {
          ...state.tokens,
          [action.data]: {
            token: action.data,
            error: null,
            status: DEEP_LINK_STATUS.NONE,
          },
        },
      }
    case DEEP_LINK_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }
    case DEEP_LINK_PROCESSED:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          [action.data]: {
            ...state.tokens[action.data],
            status: DEEP_LINK_STATUS.PROCESSED,
          },
        },
      }
    case DEEP_LINK_EMPTY:
      return {
        ...state,
        isLoading: false,
        tokens: {},
        error: null,
      }

    case RESET:
      return initialState

    default:
      return state
  }
}

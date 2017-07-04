const initialState = {
  token: null,
  isLoading: true,
  error: null,
}

const DEEP_LINK_ERROR = 'DEEP_LINK_ERROR'
const DEEP_LINK_DATA = 'DEEP_LINK_DATA'
const DEEP_LINK_EMPTY = 'DEEP_LINK_EMPTY'

// action creators
export const deepLinkData = data => ({
  type: DEEP_LINK_DATA,
  data,
})

export const deepLinkEmpty = () => ({
  type: DEEP_LINK_EMPTY,
})

export const deepLinkError = error => ({
  type: DEEP_LINK_DATA,
  error,
})

export default function deepLinkReducer(state = initialState, action) {
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

const initResData = {
  isFetching: false,
  isPristine: true,
  data: null,
  error: null,
}

const initialState = {
  avatarTapCount: 0,
  enrollRes: initResData,
  pollRes: initResData,
  contextRes: initResData,
}

export const Enroll = device => ({
  type: 'ENROLL',
  device,
})

export const Poll = identifier => ({
  type: 'POLL',
  identifier,
})

export const TapCount = newCount => ({
  type: 'TAP_COUNT',
  newCount,
})

export const SendAppContext = context => ({
  type: 'APP_CONTEXT',
  context,
})

export default function home(state = initialState, action) {
  switch (action.type) {
    case 'ENROLL':
      return {
        ...state,
        enrollRes: {
          ...state.enrollRes,
          isFetching: true,
          isPristine: false,
        },
      }
    case 'ENROLL_SUCCESS':
      return {
        ...state,
        enrollRes: {
          ...state.enrollRes,
          isFetching: false,
          data: action.enrollRes,
        },
      }
    case 'ENROLL_FAILURE':
      return {
        ...state,
        enrollRes: {
          ...state.enrollRes,
          isFetching: false,
          error: action.error,
        },
      }
    case 'POLL':
      return {
        ...state,
        pollRes: {
          ...state.pollRes,
          isFetching: true,
          isPristine: false,
        },
      }
    case 'POLL_SUCCESS':
      return {
        ...state,
        pollRes: {
          ...state.pollRes,
          isFetching: false,
          data: action.pollRes,
        },
      }
    case 'POLL_FAILURE':
      return {
        ...state,
        pollRes: {
          ...state.pollRes,
          isFetching: false,
          error: action.error,
        },
      }
    case 'TAP_COUNT':
      return {
        ...state,
        avatarTapCount: action.newCount,
      }
    case 'APP_CONTEXT':
      return {
        ...state,
        contextRes: {
          ...state.contextRes,
          isFetching: true,
          isPristine: false,
        },
      }
    case 'APP_CONTEXT_SUCCESS':
      return {
        ...state,
        contextRes: {
          ...state.contextRes,
          isFetching: false,
          data: action.contextRes,
        },
      }
    case 'APP_CONTEXT_FAILURE':
      return {
        ...state,
        contextRes: {
          ...state.contextRes,
          isFetching: false,
          error: action.error,
        },
      }
    default:
      return state
  }
}

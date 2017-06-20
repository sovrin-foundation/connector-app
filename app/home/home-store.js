const initResponseData = {
  isFetching: false,
  isPristine: true,
  data: null,
  error: null,
}

const initialState = {
  avatarTapCount: 0,
  enrollResponse: initResponseData,
  userInfoResponse: initResponseData,
}

export const enroll = device => ({
  type: 'ENROLL',
  device,
})

export const avatarTapped = avatarTapCount => ({
  type: 'AVATAR_TAPPED',
  avatarTapCount: avatarTapCount + 1,
})

export const sendUserInfo = userInfo => ({
  type: 'SEND_USER_INFO',
  userInfo,
})

export default function home(state = initialState, action) {
  switch (action.type) {
    case 'ENROLL':
      return {
        ...state,
        enrollResponse: {
          ...state.enrollResponse,
          isFetching: true,
          isPristine: false,
        },
      }
    case 'ENROLL_SUCCESS':
      return {
        ...state,
        enrollResponse: {
          ...state.enrollResponse,
          isFetching: false,
          data: action.enrollResponse,
        },
      }
    case 'ENROLL_FAILURE':
      return {
        ...state,
        enrollResponse: {
          ...state.enrollResponse,
          isFetching: false,
          error: action.error,
        },
      }
    case 'AVATAR_TAPPED':
      return {
        ...state,
        avatarTapCount: action.avatarTapCount,
      }
    case 'SEND_USER_INFO':
      return {
        ...state,
        userInfoResponse: {
          ...state.userInfoResponse,
          isFetching: true,
          isPristine: false,
        },
      }
    case 'USER_INFO_SUCCESS':
      return {
        ...state,
        userInfoResponse: {
          ...state.userInfoResponse,
          isFetching: false,
          data: action.userInfoResponse,
        },
      }
    case 'USER_INFO_FAILURE':
      return {
        ...state,
        userInfoResponse: {
          ...state.userInfoResponse,
          isFetching: false,
          error: action.error,
        },
      }
    default:
      return state
  }
}

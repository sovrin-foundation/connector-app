const initialState = {
  isAllowed: false,
}

export const pushNotificationPermissionAction = isAllowed => ({
  type: 'PUSH_NOTIFICATION_PERMISSION',
  isAllowed,
})

export default function pushNotification(state = initialState, action) {
  switch (action.type) {
    case 'PUSH_NOTIFICATION_PERMISSION':
      return {
        ...state,
        isAllowed: action.isAllowed,
      }
    default:
      return state
  }
}

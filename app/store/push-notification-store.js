const initialState = {
  isAllowed: false,
  notification: null,
}

const PUSH_NOTIFICATION_PERMISSION = 'PUSH_NOTIFICATION_PERMISSION'
const PUSH_NOTIFICATION_RECEIVED = 'PUSH_NOTIFICATION_RECEIVED'

export const pushNotificationPermissionAction = isAllowed => ({
  type: PUSH_NOTIFICATION_PERMISSION,
  isAllowed,
})

export const pushNotificationReceived = notification => ({
  type: PUSH_NOTIFICATION_RECEIVED,
  notification,
})

export default function pushNotification(state = initialState, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION_PERMISSION:
      return {
        ...state,
        isAllowed: action.isAllowed,
      }
    case PUSH_NOTIFICATION_RECEIVED:
      return {
        ...state,
        notification: action.notification,
      }
    default:
      return state
  }
}

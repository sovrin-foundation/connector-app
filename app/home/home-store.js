import { enroll, poll, sendAppContext } from '../services/api'

const initialState = {
  tapCount: 0,
  enrollApi: 'NO_ACTION',
  pollApi: 'NO_ACTION',
  appContextApi: 'NO_ACTION',
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
  type: 'SEND_APP_CONTEXT',
  context,
})

export default function home(state = initialState, action) {
  switch (action.type) {
    case 'ENROLL':
      return {
        ...state,
        enrollApi: enroll(action.device),
      }
    case 'POLL':
      return {
        ...state,
        pollApi: poll(action.identifier),
      }
    case 'TAP_COUNT':
      return {
        ...state,
        tapCount: action.newCount,
      }
    case 'SEND_APP_CONTEXT':
      return {
        ...state,
        appContextApi: sendAppContext(action.context),
      }
    default:
      return state
  }
}

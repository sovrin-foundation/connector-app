import { sendAuthRequest } from '../services/api'

const invitationStatus = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  NO_ACTION: 'NO_ACTION',
}

const initialState = {
  status: invitationStatus.NO_ACTION,
  invitationApiData: {},
  invitation: {
    inviter: {
      image: '',
      name: '',
    },
    text: '',
    title: '',
  },
  invitee: {
    image: './images/inviter.jpeg',
  },
}

const INVITATION_RECEIVED = 'INVITATION_RECEIVED'
const INVITATION_REJECTED = 'INVITATION_REJECTED'
const INVITATION_ACCEPTED = 'INVITATION_ACCEPTED'
const AUTH_REQUEST = 'AUTH_REQUEST'

export const invitationReceived = invitation => ({
  type: INVITATION_RECEIVED,
  invitation,
})

export const invitationAccepted = () => ({
  type: INVITATION_ACCEPTED,
})

export const invitationRejected = () => ({
  type: INVITATION_REJECTED,
})

export const authRequest = reqData => ({
  type: AUTH_REQUEST,
  reqData,
})

export default function invitation(state = initialState, action) {
  switch (action.type) {
    case INVITATION_RECEIVED:
      return {
        ...state,
        invitation: action.invitation,
      }
    case INVITATION_ACCEPTED:
      return {
        ...state,
        status: invitationStatus.ACCEPTED,
      }
    case INVITATION_REJECTED:
      return {
        ...state,
        status: invitationStatus.REJECTED,
      }
    case AUTH_REQUEST:
      return {
        ...state,
        invitationApiData: sendAuthRequest(action.reqData),
      }
    default:
      return state
  }
}

const invitationStatus = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  NO_ACTION: 'NO_ACTION',
}

const initialState = {
  status: invitationStatus.NO_ACTION,
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
    default:
      return state
  }
}

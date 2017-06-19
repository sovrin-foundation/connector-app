import { call, put, takeLatest } from 'redux-saga/effects'
import { sendAuthRequest } from '../services/api'

const invitationStatus = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  NO_ACTION: 'NO_ACTION',
}

const initialState = {
  status: invitationStatus.NO_ACTION,
  authRes: {
    newStatus: 'none',
    data: null,
    error: null,
    isFetching: false,
    isPristine: true,
  },
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
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_FAILURE = 'AUTH_FAILURE'

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

const authSuccess = authRes => ({
  type: AUTH_SUCCESS,
  authRes,
})

const authFailure = authRes => ({
  type: AUTH_FAILURE,
  authRes,
})

export function* callAuthRequest(action) {
  try {
    const authRes = yield call(sendAuthRequest, action.reqData)
    yield put(authSuccess(authRes))
  } catch (e) {
    yield put(authFailure(e.message))
  }
}

export function* watchAuthRequest() {
  yield takeLatest(AUTH_REQUEST, callAuthRequest)
}

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
        authRes: {
          ...state.authRes,
          newStatus: action.reqData.newStatus,
          isFetching: true,
          isPristine: false,
        },
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        authRes: {
          ...state.authRes,
          data: action.authRes,
          isFetching: false,
          isPristine: true,
        },
      }
    case AUTH_FAILURE:
      return {
        ...state,
        authRes: {
          ...state.authRes,
          error: action.authRes,
          isFetching: false,
          isPristine: true,
        },
      }
    default:
      return state
  }
}

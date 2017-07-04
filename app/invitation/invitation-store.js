import { put, takeLatest, call, all } from 'redux-saga/effects'
import {
  invitationDetailsRequest,
  sendAuthenticationRequest,
  sendInvitationConnectionRequest,
} from '../services/api'

export const INVITATION_STATUS = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  NONE: 'NONE',
}

export const INVITATION_TYPE = {
  NONE: 'NONE',
  PENDING_CONNECTION_REQUEST: 'PENDING_CONNECTION_REQUEST',
  AUTHENTICATION_REQUEST: 'AUTHENTICATION',
}

// TODO: Add isLoading and isPrestine to check for user action call
const initialState = {
  inviter: {
    image: '',
  },
  invitee: {
    image: './images/inviter.jpeg',
  },
  data: null,
  error: null,
  type: INVITATION_TYPE.NONE,
  status: INVITATION_STATUS.NONE,
}

const AUTHENTICATION_REQUEST = 'AUTHENTICATION_REQUEST'
const AUTHENTICATION_REQUEST_RECEIVED = 'AUTHENTICATION_REQUEST_RECEIVED'
const PENDING_CONNECTION_REQUEST = 'PENDING_CONNECTION_REQUEST'
const PENDING_CONNECTION_SUCCESS = 'PENDING_CONNECTION_SUCCESS'
const PENDING_CONNECTION_FAILURE = 'PENDING_CONNECTION_FAILURE'
const SEND_USER_INVITATION_RESPONSE = 'SEND_USER_INVITATION_RESPONSE'
const SEND_USER_INVITATION_RESPONSE_SUCCESS =
  'SEND_USER_INVITATION_RESPONSE_SUCCESS'
const SEND_USER_INVITATION_RESPONSE_FAILURE =
  'SEND_USER_INVITATION_RESPONSE_FAILURE'
const RESET_INVITATION = 'RESET_INVITATION'

export const getInvitationDetailsRequest = (token, config) => ({
  type: PENDING_CONNECTION_REQUEST,
  token,
  config,
})

export const pendingConnectionSuccess = data => ({
  type: PENDING_CONNECTION_SUCCESS,
  data,
})

export const pendingConnectionFailure = error => ({
  type: PENDING_CONNECTION_FAILURE,
  error,
})

export const sendUserInvitationResponse = (
  data,
  config,
  invitationType,
  token
) => ({
  type: SEND_USER_INVITATION_RESPONSE,
  data,
  config,
  invitationType,
  token,
})

export const sendUserInvitationResponseSuccess = data => ({
  type: SEND_USER_INVITATION_RESPONSE_SUCCESS,
  data,
})

export const sendUserInvitationResponseFailure = error => ({
  type: SEND_USER_INVITATION_RESPONSE_FAILURE,
  error,
})

export const authenticationRequestReceived = data => ({
  type: AUTHENTICATION_REQUEST_RECEIVED,
  data,
})

export const resetInvitation = () => ({
  type: RESET_INVITATION,
})

export function* callPendingConnectionRequest(action) {
  try {
    const pendingConnectionResponse = yield call(
      invitationDetailsRequest,
      action.token,
      action.config
    )
    yield put(pendingConnectionSuccess(pendingConnectionResponse))
  } catch (e) {
    yield put(pendingConnectionFailure(e.message))
  }
}

export function* watchPendingConnectionRequest() {
  yield takeLatest(PENDING_CONNECTION_REQUEST, callPendingConnectionRequest)
}

export function* watchLoadInvitationDetailsRequest() {
  yield takeLatest(SEND_USER_INVITATION_RESPONSE, handleUserInvitationResponse)
}

function* handleUserInvitationResponse(action) {
  try {
    let invitationActionResponse = null
    if (action.invitationType == AUTHENTICATION_REQUEST) {
      invitationActionResponse = yield call(
        sendAuthenticationRequest,
        action.data,
        action.config
      )
    } else {
      invitationActionResponse = yield call(
        sendInvitationConnectionRequest,
        action
      )
    }
    yield put(sendUserInvitationResponseSuccess(invitationActionResponse))
  } catch (e) {
    yield put(sendUserInvitationResponseFailure(e.message))
  }
}

export function* watchInvitation() {
  yield all([
    watchPendingConnectionRequest(),
    watchLoadInvitationDetailsRequest(),
  ])
}

export default function invitation(state = initialState, action) {
  switch (action.type) {
    case PENDING_CONNECTION_REQUEST:
      return {
        ...state,
        status: INVITATION_STATUS.NONE,
        type: INVITATION_TYPE.PENDING_CONNECTION_REQUEST,
      }
    case PENDING_CONNECTION_SUCCESS:
      return {
        ...state,
        data: action.data,
        type: INVITATION_TYPE.PENDING_CONNECTION_REQUEST,
      }
    case PENDING_CONNECTION_FAILURE:
      return {
        ...state,
        error: action.error,
      }
    case SEND_USER_INVITATION_RESPONSE_SUCCESS:
      return {
        ...state,
        status: INVITATION_STATUS.ACCEPTED,
      }
    case SEND_USER_INVITATION_RESPONSE_FAILURE:
      return {
        ...state,
        status: INVITATION_STATUS.REJECTED,
        error: action.error,
      }
    case RESET_INVITATION:
      return {
        ...state,
        type: INVITATION_TYPE.NONE,
        status: INVITATION_STATUS.NONE,
        data: null,
        error: null,
      }
    case AUTHENTICATION_REQUEST_RECEIVED:
      return {
        ...state,
        type: INVITATION_TYPE.AUTHENTICATION_REQUEST,
        status: INVITATION_STATUS.NONE,
        data: action.data,
        error: null,
      }
    default:
      return state
  }
}

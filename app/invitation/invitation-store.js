import { put, takeLatest, call, all } from 'redux-saga/effects'
import {
  invitationDetailsRequest,
  sendAuthenticationRequest,
  sendInvitationConnectionRequest,
} from '../services/api'

export const INVITATION_STATUS = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NONE: 'NONE',
}

export const INVITATION_TYPE = {
  NONE: 'NONE',
  PENDING_CONNECTION_REQUEST: 'PENDING_CONNECTION_REQUEST',
  AUTHENTICATION_REQUEST: 'AUTHENTICATION_REQUEST',
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
  connectionRequestCount: 0,
}

// const AUTHENTICATION_REQUEST = 'AUTHENTICATION_REQUEST'
const AUTHENTICATION_REQUEST_RECEIVED = 'AUTHENTICATION_REQUEST_RECEIVED'
const PENDING_CONNECTION_REQUEST = 'PENDING_CONNECTION_REQUEST'
const PENDING_CONNECTION_SUCCESS = 'PENDING_CONNECTION_SUCCESS'
const PENDING_CONNECTION_FAILURE = 'PENDING_CONNECTION_FAILURE'
const SEND_USER_INVITATION_RESPONSE = 'SEND_USER_INVITATION_RESPONSE'
const SEND_USER_INVITATION_RESPONSE_SUCCESS =
  'SEND_USER_INVITATION_RESPONSE_SUCCESS'
const SEND_USER_INVITATION_RESPONSE_FAILURE =
  'SEND_USER_INVITATION_RESPONSE_FAILURE'
const RESET_INVITATION_STATUS = 'RESET_INVITATION_STATUS'

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

export const resetInvitationStatus = () => ({
  type: RESET_INVITATION_STATUS,
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
    yield put(pendingConnectionFailure(JSON.parse(e.message)))
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
    if (action.invitationType == INVITATION_TYPE.AUTHENTICATION_REQUEST) {
      invitationActionResponse = yield call(sendAuthenticationRequest, action)
    } else {
      invitationActionResponse = yield call(
        sendInvitationConnectionRequest,
        action
      )
    }
    yield put(sendUserInvitationResponseSuccess(invitationActionResponse))
  } catch (e) {
    yield put(
      sendUserInvitationResponseFailure({
        message: e.message,
        invitationType: action.invitationType,
      })
    )
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
        connectionRequestCount: 0,
        status: INVITATION_STATUS.NONE,
        type: INVITATION_TYPE.PENDING_CONNECTION_REQUEST,
      }
    case PENDING_CONNECTION_SUCCESS:
      return {
        ...state,
        connectionRequestCount: 1,
        data: action.data,
        type: INVITATION_TYPE.PENDING_CONNECTION_REQUEST,
      }
    case PENDING_CONNECTION_FAILURE:
      return {
        ...state,
        connectionRequestCount: 0,
        error: action.error,
      }
    case SEND_USER_INVITATION_RESPONSE:
      return {
        ...state,
        status: action.data.newStatus,
      }
    case SEND_USER_INVITATION_RESPONSE_SUCCESS:
      const { authStatus } = action.data
      return {
        ...state,
      }
    case SEND_USER_INVITATION_RESPONSE_FAILURE:
      return {
        ...state,
        error: action.error.invitationType ===
          INVITATION_TYPE.PENDING_CONNECTION_REQUEST
          ? action.error.message
          : null,
      }
    case RESET_INVITATION_STATUS:
      return {
        ...state,
        type: INVITATION_TYPE.NONE,
        status: INVITATION_STATUS.NONE,
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

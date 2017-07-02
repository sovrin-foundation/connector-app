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
  AUTHENCTICATION_REQUEST: 'AUTHENTICATION',
}

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
const PENDING_CONNECTION_REQUEST = 'PENDING_CONNECTION_REQUEST'
const PENDING_CONNECTION_SUCCESS = 'PENDING_CONNECTION_SUCCESS'
const PENDING_CONNECTION_FAILURE = 'PENDING_CONNECTION_FAILURE'
const SEND_USER_INVITATION_RESPONSE = 'SEND_USER_INVITATION_RESPONSE'
const SEND_USER_INVITATION_RESPONSE_SUCCESS =
  'SEND_USER_INVITATION_RESPONSE_SUCCESS'
const SEND_USER_INVITATION_RESPONSE_FAILURE =
  'SEND_USER_INVITATION_RESPONSE_FAILURE'

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

export const sendUserInvitationResponse = (data, config) => ({
  type: SEND_USER_INVITATION_RESPONSE,
  data,
  config,
})

export const sendUserInvitationResponseSuccess = data => ({
  type: SEND_USER_INVITATION_RESPONSE_SUCCESS,
  data,
})

export const sendUserInvitationResponseFailure = error => ({
  type: SEND_USER_INVITATION_RESPONSE_FAILURE,
  error,
})

export const authenticationRequest = data => ({
  type: INVITATION_TYPE.AUTHENCATION_REQUEST,
  data,
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
  yield takeLatest(
    SEND_USER_INVITATION_RESPONSE,
    handleUserInvitationDetailsRequest
  )
}

function* handleUserInvitationDetailsRequest(action) {
  try {
    const userInvitaitonDetailsResponse = yield call(
      sendInvitationConnectionRequest,
      action.data,
      action.config
    )
    yield put(sendUserInvitationResponseSuccess(userInvitaitonDetailsResponse))
  } catch (e) {
    yield put(sendUserInvitationResponseFailure(e.message))
  }
}

export function* callAuthRequest(action) {
  try {
    const authResponse = yield call(sendAuthRequest, action.data, action.config)
    yield put(sendUserInvitationResponseSuccess(authResponse))
  } catch (e) {
    yield put(sendUserInvitationResponseSuccess(e.message))
  }
}

export function* watchAuthenticationRequest() {
  yield takeLatest(AUTHENTICATION_REQUEST, callAuthRequest)
}

export function* watchInvitation() {
  yield all([
    watchPendingConnectionRequest(),
    watchLoadInvitationDetailsRequest(),
    watchAuthenticationRequest(),
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
        data: {
          offerMsgTitle: action.data.offerMsgTitle,
          offerMsgText: action.data.offerMsgText,
          status: action.data.status,
        },
        type: INVITATION_TYPE.PENDING_CONNECTION_REQUEST,
      }
    case PENDING_CONNECTION_FAILURE:
      return {
        ...state,
        error: action.error,
      }
    case SEND_USER_INVITATION_RESPONSE:
      return {
        ...state,
        status: action.data.newStatus,
      }
    case SEND_USER_INVITATION_RESPONSE_SUCCESS:
      return {
        ...state,
        status: INVITATION_STATUS.ACCEPTED,
      }
    case SEND_USER_INVITATION_RESPONSE_FAILURE:
      return {
        ...state,
        state: INVITATION_STATUS.REJECTED,
        error: action.error,
      }
    case AUTHENTICATION_REQUEST:
      return {
        ...state,
        type: INVITATION_TYPE.AUTHENCATION_REQUEST,
      }
    default:
      return state
  }
}

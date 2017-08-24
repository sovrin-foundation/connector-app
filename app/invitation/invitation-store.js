import { put, takeLatest, call, all } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {
  invitationDetailsRequest,
  sendAuthenticationRequest,
  sendInvitationConnectionRequest,
} from '../services'
import { saveNewConnection } from '../store/connections-store'

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

const initialState = {
  inviter: { image: '' },
  invitee: { image: './images/inviter.jpeg' },
  data: null,
  error: null,
  type: INVITATION_TYPE.NONE,
  status: INVITATION_STATUS.NONE,
  isFetching: false,
  isPristine: true,
}

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
  token,
  newConnection
) => ({
  type: SEND_USER_INVITATION_RESPONSE,
  data,
  config,
  invitationType,
  token,
  newConnection,
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
  const { invitationType } = action
  try {
    let invitationActionResponse = null
    if (invitationType == INVITATION_TYPE.AUTHENTICATION_REQUEST) {
      invitationActionResponse = yield call(sendAuthenticationRequest, action)
      yield put(sendUserInvitationResponseSuccess(action.data))
    } else {
      if (
        action.invitationType === INVITATION_TYPE.PENDING_CONNECTION_REQUEST
      ) {
        //TODO: separate out invitation and connection actions
        invitationActionResponse = yield call(
          sendInvitationConnectionRequest,
          action
        )
      }

      // if user accepted it, then save a new connection otherwise don't save a new connection
      if (action.data.newStatus === INVITATION_STATUS.ACCEPTED) {
        yield put(saveNewConnection(action))
      }
      // raise success here, because new connection will be added
      // by connection store
      yield put(
        sendUserInvitationResponseSuccess({
          newStatus: action.data.newStatus,
        })
      )
    }
  } catch (e) {
    yield put(
      sendUserInvitationResponseFailure({
        message: e.message,
        invitationType: action.invitationType,
      })
    )
  }

  // once everything is done, we clear the invitation related data
  // because it needs to be used for some other invitation as well
  yield call(delay, 3000)
  yield put(resetInvitationStatus())
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
    case SEND_USER_INVITATION_RESPONSE:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
      }
    case SEND_USER_INVITATION_RESPONSE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        status: action.data.newStatus,
      }
    case SEND_USER_INVITATION_RESPONSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case RESET_INVITATION_STATUS:
      return {
        ...state,
        type: INVITATION_TYPE.NONE,
        status: INVITATION_STATUS.NONE,
        error: null,
        data: null,
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

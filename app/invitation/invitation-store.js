import { put, takeLatest, call, all } from 'redux-saga/effects'
import {
  invitationDetailsRequest,
  sendAuthenticationRequest,
  sendInvitationConnectionRequest,
  sendQRInvitationResponse,
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
  QR_CONNECTION_REQUEST: 'QR_CONNECTION_REQUEST',
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
const QR_CONNECTION_REQUEST = 'QR_CONNECTION_REQUEST'

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

export const qrConnectionRequestReceived = data => ({
  type: QR_CONNECTION_REQUEST,
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
      yield put(sendUserInvitationResponseSuccess(action))
    } else {
      if (
        action.invitationType === INVITATION_TYPE.PENDING_CONNECTION_REQUEST
      ) {
        //TODO: separate out invitation and connection actions
        invitationActionResponse = yield call(
          sendInvitationConnectionRequest,
          action
        )
      } else {
        invitationActionResponse = yield call(sendQRInvitationResponse, action)
      }
      yield put(saveNewConnection(action))
    }
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
      // TODO:KS What is this happening here,
      // why are we not considering anything from success response?
      return {
        ...state,
        isFetching: false,
        status: action.data.newStatus,
      }
    case SEND_USER_INVITATION_RESPONSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        //TODO:PS:Not sure why we conditionally setting error, disabled for now
        //If you think we need it, mention reason and un-comment it

        // error: action.error.invitationType ===
        //   INVITATION_TYPE.PENDING_CONNECTION_REQUEST
        //   ? action.error.message
        //   : null,
        error: action.error,
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
    case QR_CONNECTION_REQUEST:
      return {
        ...state,
        data: action.data,
        type: INVITATION_TYPE.QR_CONNECTION_REQUEST,
        status: INVITATION_STATUS.NONE,
      }
    default:
      return state
  }
}

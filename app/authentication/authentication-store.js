// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { sendAuthenticationRequest } from '../api/api'
import type { ConfigStore } from '../store/type-config-store'
import type {
  AuthenticationStatus,
  AuthenticationType,
  AuthenticationStore,
  AuthenticationPayload,
  AuthenticationError,
  AuthenticationAction,
  SendUserAuthenticationResponse,
  AuthenticationSuccessData,
  SendUserAuthenticationResponseSuccess,
  SendUserAuthenticationResponseFailure,
  ResetAuthenticationStatus,
  AuthenticationRequestReceived,
} from './type-authentication'
import { RESET } from '../common/type-common'

export const AUTHENTICATION_STATUS: AuthenticationStatus = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NONE: 'NONE',
}

export const AUTHENTICATION_TYPE: AuthenticationType = {
  NONE: 'NONE',
  AUTHENTICATION_REQUEST: 'AUTHENTICATION_REQUEST',
}

const initialState: AuthenticationStore = {
  inviter: { image: '' },
  invitee: { image: './images/inviter.jpeg' },
  data: null,
  error: null,
  type: AUTHENTICATION_TYPE.NONE,
  status: AUTHENTICATION_STATUS.NONE,
  isFetching: false,
  isPristine: true,
}

const AUTHENTICATION_REQUEST_RECEIVED = 'AUTHENTICATION_REQUEST_RECEIVED'
const SEND_USER_AUTHENTICATION_RESPONSE = 'SEND_USER_AUTHENTICATION_RESPONSE'
const SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS =
  'SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS'
const SEND_USER_AUTHENTICATION_RESPONSE_FAILURE =
  'SEND_USER_AUTHENTICATION_RESPONSE_FAILURE'
const RESET_AUTHENTICATION_STATUS = 'RESET_AUTHENTICATION_STATUS'

export const sendUserAuthenticationResponse = (
  data: AuthenticationSuccessData,
  config: ConfigStore,
  authenticationType: string
): SendUserAuthenticationResponse => ({
  type: SEND_USER_AUTHENTICATION_RESPONSE,
  data,
  config,
  authenticationType,
})

export const sendUserAuthenticationResponseSuccess = (
  data: AuthenticationSuccessData
): SendUserAuthenticationResponseSuccess => ({
  type: SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS,
  data,
})

export const sendUserAuthenticationResponseFailure = (
  error: AuthenticationError
): SendUserAuthenticationResponseFailure => ({
  type: SEND_USER_AUTHENTICATION_RESPONSE_FAILURE,
  error,
})

export const authenticationRequestReceived = (
  data: AuthenticationPayload
): AuthenticationRequestReceived => ({
  type: AUTHENTICATION_REQUEST_RECEIVED,
  data,
})

export const resetAuthenticationStatus = (): ResetAuthenticationStatus => ({
  type: RESET_AUTHENTICATION_STATUS,
})

export function* watchLoadAuthenticationDetailsRequest(): any {
  yield takeLatest(
    SEND_USER_AUTHENTICATION_RESPONSE,
    handleUserAuthenticationResponse
  )
}

function* handleUserAuthenticationResponse(
  action: SendUserAuthenticationResponse
): Generator<*, *, *> {
  const { authenticationType } = action
  try {
    let authenticationActionResponse = null
    if (authenticationType == AUTHENTICATION_TYPE.AUTHENTICATION_REQUEST) {
      const { remoteConnectionId, dataBody: { challenge } } = action.data
      // TODO: Fix authentication flow
      const signature = ''
      // add signature
      action.data.dataBody.signature = signature

      // TODO: Fix this while fixing authentication flow
      // authenticationActionResponse = yield call(
      //   sendAuthenticationRequest,
      //   action
      // )
      // yield put(sendUserAuthenticationResponseSuccess(action.data))
    }
  } catch (e) {
    yield put(
      sendUserAuthenticationResponseFailure({
        message: e.message,
        authenticationType: action.authenticationType,
      })
    )
  }
}

export function* watchAuthentication(): any {
  yield all([watchLoadAuthenticationDetailsRequest()])
}

export default function authentication(
  state: AuthenticationStore = initialState,
  action: AuthenticationAction
): AuthenticationStore {
  switch (action.type) {
    case SEND_USER_AUTHENTICATION_RESPONSE:
      return {
        ...state,
        isFetching: true,
        isPristine: false,
      }
    case SEND_USER_AUTHENTICATION_RESPONSE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        status: action.data.newStatus,
      }
    case SEND_USER_AUTHENTICATION_RESPONSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case RESET_AUTHENTICATION_STATUS:
      return {
        ...state,
        type: AUTHENTICATION_TYPE.NONE,
        status: AUTHENTICATION_STATUS.NONE,
        error: null,
        data: null,
      }
    case AUTHENTICATION_REQUEST_RECEIVED:
      return {
        ...state,
        type: AUTHENTICATION_TYPE.AUTHENTICATION_REQUEST,
        status: AUTHENTICATION_STATUS.NONE,
        data: action.data,
        error: null,
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

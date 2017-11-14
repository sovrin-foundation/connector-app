// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import {
  INVITATION_RECEIVED,
  INVITATION_RESPONSE_SEND,
  INVITATION_RESPONSE_SUCCESS,
  INVITATION_RESPONSE_FAIL,
  INVITATION_REJECTED,
} from './type-invitation'
import { ResponseType } from '../components/request/type-request'
import {
  connectWithConsumerAgency,
  registerWithConsumerAgency,
  createAgentWithConsumerAgency,
  createAgentPairwiseKey,
  sendInvitationResponse as sendInvitationResponseApi,
} from '../api/api'
import {
  API_TYPE,
  ERROR_ALREADY_EXIST,
  ERROR_INVITATION_RESPONSE_PARSE_CODE,
  ERROR_INVITATION_RESPONSE_PARSE,
} from '../api/api-constants'
import {
  getAgencyUrl,
  getPushToken,
  getInvitationPayload,
  isDuplicateConnection,
} from '../store/store-selector'
import { saveNewConnection } from '../store/connections-store'
import { encrypt, addConnection } from '../bridge/react-native-cxs/RNCxs'
import type {
  InvitationReceivedActionData,
  InvitationResponseSendData,
  InvitationResponseSendAction,
  InvitationPayload,
  InvitationStore,
  InvitationAction,
} from './type-invitation'
import type { CustomError } from '../common/type-common'

export const invitationInitialState = {}

export const invitationReceived = (data: InvitationReceivedActionData) => ({
  type: INVITATION_RECEIVED,
  data,
})

export const sendInvitationResponse = (data: InvitationResponseSendData) => ({
  type: INVITATION_RESPONSE_SEND,
  data,
})

export const invitationSuccess = (senderDID: string) => ({
  type: INVITATION_RESPONSE_SUCCESS,
  senderDID,
})

export const invitationFail = (error: CustomError, senderDID: string) => ({
  type: INVITATION_RESPONSE_FAIL,
  error,
  senderDID,
})

export const invitationRejected = (senderDID: string) => ({
  type: INVITATION_REJECTED,
  senderDID,
})

export function* sendResponse(
  action: InvitationResponseSendAction
): Generator<*, *, *> {
  const { senderDID } = action.data
  // get data needed for agent api call from store using selectors
  // this will keep our components and screen to not pass data
  // and will keep our actions lean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const payload: InvitationPayload = yield select(
    getInvitationPayload,
    senderDID
  )
  const alreadyExist: boolean = yield select(isDuplicateConnection, senderDID)

  if (alreadyExist) {
    yield put(invitationFail(ERROR_ALREADY_EXIST, senderDID))
  } else {
    const metadata = {
      ...payload,
    }
    // TODO: This will remain hard coded and it should come from config store
    // we need to switch this as well while switching environment
    const agencyDid = '5qiK8KZQ86XjcnLmy5S2Tn'
    const agencyVerificationKey = '3dzsPMyBeJiGtsxWoyrfXZL6mqj3iXxdJ75vewJ1jSwn'
    const { identifier, verificationKey } = yield call(
      addConnection,
      agencyDid,
      agencyVerificationKey,
      metadata
    )

    try {
      const connectResponse = yield call(connectWithConsumerAgency, {
        agencyUrl,
        dataBody: {
          type: API_TYPE.CONNECT,
          fromDID: identifier,
          fromDIDVerKey: verificationKey,
        },
      })

      const registerResponse = yield call(registerWithConsumerAgency, {
        agencyUrl,
        dataBody: {
          type: API_TYPE.REGISTER,
          fromDID: identifier,
        },
      })

      const createAgentResponse = yield call(createAgentWithConsumerAgency, {
        agencyUrl,
        dataBody: {
          type: API_TYPE.CREATE_AGENT,
          forDID: identifier,
        },
      })

      const pairwiseConnection = yield call(
        addConnection,
        senderDID,
        payload.senderVerificationKey,
        metadata
      )

      const createPairwiseKey = yield call(createAgentPairwiseKey, {
        agencyUrl,
        dataBody: {
          to: identifier,
          agentPayload: JSON.stringify({
            type: API_TYPE.CREATE_KEY,
            forDID: pairwiseConnection.identifier,
            forDIDVerKey: pairwiseConnection.verificationKey,
            nonce: '12121212',
          }),
        },
      })

      const dataBody = {
        to: pairwiseConnection.identifier,
        agentPayload: JSON.stringify({
          type: API_TYPE.INVITE_ANSWERED,
          uid: payload.requestId,
          // TODO: get this data from agent registration
          keyDlgProof: 'delegate to agent',
          senderName: payload.senderName,
          senderLogoUrl: payload.senderLogoUrl,
          senderDID,
          senderDIDVerKey: payload.senderVerificationKey,
          remoteAgentKeyDlgProof: payload.senderAgentKeyDelegationProof,
          remoteEndpoint: payload.senderEndpoint,
          pushComMethod: `FCM:${pushToken}`,
        }),
      }

      // TODO:KS Check errors from backend in api utils
      yield call(sendInvitationResponseApi, {
        agencyUrl,
        dataBody,
      })

      yield put(invitationSuccess(senderDID))

      if (action.data.response === ResponseType.accepted) {
        const connection = {
          newConnection: {
            identifier: pairwiseConnection.identifier,
            logoUrl: payload.senderLogoUrl,
            ...payload,
          },
        }
        yield put(saveNewConnection(connection))
      }
    } catch (e) {
      let error: CustomError = {
        code: ERROR_INVITATION_RESPONSE_PARSE_CODE,
        message: ERROR_INVITATION_RESPONSE_PARSE,
      }
      try {
        error = JSON.parse(e.message)
      } catch (_) {}
      yield put(invitationFail(error, senderDID))
    }
  }
}

function* watchSendInvitationResponse() {
  yield takeLatest(INVITATION_RESPONSE_SEND, sendResponse)
}

export function* watchInvitation(): Generator<*, *, *> {
  yield all([watchSendInvitationResponse()])
}

export default function invitationReducer(
  state: InvitationStore = invitationInitialState,
  action: InvitationAction
) {
  switch (action.type) {
    case INVITATION_RECEIVED:
      return {
        ...state,
        [action.data.payload.senderDID]: {
          ...action.data,
          status: ResponseType.none,
          isFetching: false,
          error: null,
        },
      }

    case INVITATION_RESPONSE_SEND:
      return {
        ...state,
        [action.data.senderDID]: {
          ...state[action.data.senderDID],
          isFetching: true,
          status: action.data.response,
        },
      }

    case INVITATION_RESPONSE_SUCCESS:
      return {
        ...state,
        [action.senderDID]: {
          ...state[action.senderDID],
          isFetching: false,
          error: null,
        },
      }

    case INVITATION_RESPONSE_FAIL:
      return {
        ...state,
        [action.senderDID]: {
          ...state[action.senderDID],
          isFetching: false,
          error: action.error,
          status: ResponseType.none,
        },
      }

    case INVITATION_REJECTED:
      return {
        ...state,
        [action.senderDID]: {
          ...state[action.senderDID],
          isFetching: false,
          error: null,
          status: ResponseType.rejected,
        },
      }

    default:
      return state
  }
}

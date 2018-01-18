// @flow
import { AsyncStorage } from 'react-native'
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
  getAgencyDID,
  getAgencyVerificationKey,
  getPushToken,
  getInvitationPayload,
  isDuplicateConnection,
  getPoolConfig,
} from '../store/store-selector'
import { saveNewConnection } from '../store/connections-store'
import { encrypt, addConnection } from '../bridge/react-native-cxs/RNCxs'
import type {
  InvitationResponseSendData,
  InvitationResponseSendAction,
  InvitationPayload,
  InvitationStore,
  InvitationAction,
  InvitationReceivedActionData,
} from './type-invitation'
import type { CustomError } from '../common/type-common'
import { captureError } from '../services/error/error-handler'
import { IS_CONSUMER_AGENT_ALREADY_CREATED } from '../common'

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
function* createConsumerAgencyAgent(
  senderDID: string,
  identifier: string,
  verificationKey: string,
  payload: InvitationPayload
): Generator<*, *, *> {
  // get data needed for agent api call from store using selectors
  // this will keep our components and screen to not pass data
  // and will keep our actions lean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const agencyDid: string = yield select(getAgencyDID)
  const agencyVerificationKey: string = yield select(getAgencyVerificationKey)

  const metadata = {
    ...payload,
  }
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

    // now save the key in user's default storage in phone
    try {
      yield call(
        AsyncStorage.setItem,
        IS_CONSUMER_AGENT_ALREADY_CREATED,
        'true'
      )
    } catch (e) {
      // somehow the storage failed, so we need to find someway to store
      // maybe we fallback to file based storage

      // Capture AsyncStorage failed
      captureError(e)
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

export function* sendResponse(
  action: InvitationResponseSendAction
): Generator<*, *, *> {
  const { senderDID } = action.data
  // get data needed for agent api call from store using selectors
  // this will keep our components and screen to not pass data
  // and will keep our actions lean
  const agencyUrl: string = yield select(getAgencyUrl)
  const pushToken: string = yield select(getPushToken)
  const agencyDid: string = yield select(getAgencyDID)
  const agencyVerificationKey: string = yield select(getAgencyVerificationKey)
  const payload: InvitationPayload = yield select(
    getInvitationPayload,
    senderDID
  )
  const poolConfig: string = yield select(getPoolConfig)
  const metadata = {
    ...payload,
  }
  const { identifier, verificationKey } = yield call(
    addConnection,
    agencyDid,
    agencyVerificationKey,
    metadata,
    poolConfig
  )
  const alreadyExist: boolean = yield select(isDuplicateConnection, senderDID)
  if (alreadyExist) {
    yield put(invitationFail(ERROR_ALREADY_EXIST, senderDID))
  } else {
    const metadata = {
      ...payload,
    }
    const isConsumerAgentCreated = yield call(
      AsyncStorage.getItem,
      IS_CONSUMER_AGENT_ALREADY_CREATED
    )
    if (isConsumerAgentCreated !== 'true') {
      yield* createConsumerAgencyAgent(
        senderDID,
        identifier,
        verificationKey,
        payload
      )
    }

    try {
      const pairwiseConnection = yield call(
        addConnection,
        senderDID,
        payload.senderVerificationKey,
        metadata,
        poolConfig
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

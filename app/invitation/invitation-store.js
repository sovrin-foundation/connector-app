// @flow
import { Platform } from 'react-native'
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import {
  INVITATION_RECEIVED,
  INVITATION_RESPONSE_SEND,
  INVITATION_RESPONSE_SUCCESS,
  INVITATION_RESPONSE_FAIL,
  INVITATION_REJECTED,
  ERROR_INVITATION_VCX_INIT,
  ERROR_INVITATION_CONNECT,
} from './type-invitation'
import { ResponseType } from '../components/request/type-request'
import {
  ERROR_ALREADY_EXIST,
  ERROR_INVITATION_RESPONSE_PARSE_CODE,
  ERROR_INVITATION_RESPONSE_PARSE,
  SERVER_ERROR_CODE,
} from '../api/api-constants'
import {
  getAgencyUrl,
  getAgencyDID,
  getAgencyVerificationKey,
  getPushToken,
  getInvitationPayload,
  isDuplicateConnection,
  getUserOneTimeInfo,
  getPoolConfig,
} from '../store/store-selector'
import { saveNewConnection } from '../store/connections-store'
import {
  createConnectionWithInvite,
  acceptInvitationVcx,
  serializeConnection,
} from '../bridge/react-native-cxs/RNCxs'
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
import type {
  ConnectAgencyResponse,
  RegisterAgencyResponse,
  CreateOneTimeAgentResponse,
  CreatePairwiseAgentResponse,
  AcceptInvitationResponse,
} from '../bridge/react-native-cxs/type-cxs'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import { connectRegisterCreateAgentDone } from '../store/user/user-store'
import { RESET } from '../common/type-common'
import { ensureVcxInitSuccess } from '../store/config-store'
import { VCX_INIT_SUCCESS } from '../store/type-config-store'
import type { MyPairwiseInfo } from '../store/type-connection-store'
import { safeSet, safeGet } from '../services/storage'

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
  yield* ensureVcxInitSuccess()

  const { senderDID } = action.data
  const alreadyExist: boolean = yield select(isDuplicateConnection, senderDID)
  if (alreadyExist) {
    yield put(invitationFail(ERROR_ALREADY_EXIST, senderDID))

    return
  }

  try {
    const payload: InvitationPayload = yield select(
      getInvitationPayload,
      senderDID
    )
    const connectionHandle: number = yield call(
      createConnectionWithInvite,
      payload
    )
    const pairwiseInfo: MyPairwiseInfo = yield call(
      acceptInvitationVcx,
      connectionHandle
    )

    yield put(invitationSuccess(senderDID))

    // once the connection is successful, we need to save serialized connection
    // in secure storage as well, because libIndy does not handle persistence
    // once we have persisted serialized state, we can hydrate vcx
    // if we need anything from that connection
    const vcxSerializedConnection: string = yield call(
      serializeConnection,
      connectionHandle
    )
    // TODO:KS Above call will probably interfere with showing bubbles as soon as user
    // is on home screen after accepting connection
    // there are few more things that we can do, but we are not doing those here for now

    const connection = {
      newConnection: {
        identifier: pairwiseInfo.myPairwiseDid,
        logoUrl: payload.senderLogoUrl,
        myPairwiseDid: pairwiseInfo.myPairwiseDid,
        myPairwiseVerKey: pairwiseInfo.myPairwiseVerKey,
        myPairwiseAgentDid: pairwiseInfo.myPairwiseAgentDid,
        myPairwiseAgentVerKey: pairwiseInfo.myPairwiseAgentVerKey,
        myPairwisePeerVerKey: pairwiseInfo.myPairwisePeerVerKey,
        vcxSerializedConnection,
        ...payload,
      },
    }
    yield put(saveNewConnection(connection))
  } catch (e) {
    yield put(invitationFail(ERROR_INVITATION_CONNECT(e.message), senderDID))
  }
}

function* watchSendInvitationResponse(): any {
  yield takeLatest(INVITATION_RESPONSE_SEND, sendResponse)
}

export function* watchInvitation(): any {
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
          error: null,
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

    case RESET:
      return invitationInitialState

    default:
      return state
  }
}

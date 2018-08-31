// @flow
import {
  put,
  takeLatest,
  takeEvery,
  call,
  select,
  all,
} from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import type {
  ProofRequestStore,
  ProofRequestAction,
  ProofRequestShownAction,
  SendProofSuccessAction,
  SendProofFailAction,
  SendProofAction,
  ProofRequestIgnoredAction,
  ProofRequestRejectedAction,
  ProofRequestAcceptedAction,
  ProofRequestPayload,
  AdditionalProofDataPayload,
  MissingAttribute,
  SelfAttestedAttributes,
  MissingAttributes,
  ProofRequestReceivedAction,
} from './type-proof-request'

import {
  getUserPairwiseDid,
  getProofRequestPairwiseDid,
  getRemotePairwiseDidAndName,
  getProofRequest,
} from '../store/store-selector'
import {
  PROOF_REQUESTS,
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_STATUS,
  PROOF_STATUS,
  PROOF_REQUEST_SHOWN,
  PROOF_REQUEST_IGNORED,
  PROOF_REQUEST_ACCEPTED,
  PROOF_REQUEST_REJECTED,
  PROOF_REQUEST_AUTO_FILL,
  SEND_PROOF,
  SEND_PROOF_SUCCESS,
  SEND_PROOF_FAIL,
  MISSING_ATTRIBUTES_FOUND,
  ERROR_SEND_PROOF,
  HYDRATE_PROOF_REQUESTS,
  PROOF_SERIALIZED,
  UPDATE_PROOF_HANDLE,
  PROOF_REQUEST_SHOW_START,
} from './type-proof-request'
import type {
  NotificationPayloadInfo,
  Attribute,
} from '../push-notification/type-push-notification'
import {
  sendProof as sendProofApi,
  getHandleBySerializedConnection,
  proofSerialize,
} from '../bridge/react-native-cxs/RNCxs'
import type { Connection } from '../store/type-connection-store'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import { MESSAGE_TYPE } from '../api/api-constants'
import { RESET } from '../common/type-common'
import { PROOF_FAIL } from '../proof/type-proof'
import { getProofRequests } from './../store/store-selector'
import { secureSet, secureGet } from '../services/storage'

const proofRequestInitialState = {}

export const ignoreProofRequest = (uid: string): ProofRequestIgnoredAction => ({
  type: PROOF_REQUEST_IGNORED,
  uid,
})
export const rejectProofRequest = (
  uid: string
): ProofRequestRejectedAction => ({
  type: PROOF_REQUEST_REJECTED,
  uid,
})
export const acceptProofRequest = (
  uid: string
): ProofRequestAcceptedAction => ({
  type: PROOF_REQUEST_ACCEPTED,
  uid,
})
export const proofRequestShown = (uid: string): ProofRequestShownAction => ({
  type: PROOF_REQUEST_SHOWN,
  uid,
})
export const sendProof = (uid: string): SendProofAction => ({
  type: SEND_PROOF,
  uid,
})
export const sendProofSuccess = (uid: string): SendProofSuccessAction => ({
  type: SEND_PROOF_SUCCESS,
  uid,
})
export const hydrateProofRequests = (proofRequests: ProofRequestStore) => ({
  type: HYDRATE_PROOF_REQUESTS,
  proofRequests,
})

export const sendProofFail = (
  uid: string,
  error: CustomError
): SendProofFailAction => ({
  type: SEND_PROOF_FAIL,
  error,
  uid,
})

export function convertMissingAttributeListToObject(
  missingAttributes: Array<MissingAttribute>
): MissingAttributes {
  return missingAttributes.reduce(
    (selfAttestedAttributes, missingAttribute: MissingAttribute) => ({
      ...selfAttestedAttributes,
      [missingAttribute.name.toLocaleLowerCase()]: {
        name: missingAttribute.name,
        data: '',
        key: missingAttribute.key,
      },
    }),
    {}
  )
}

export const missingAttributesFound = (
  missingAttributeList: MissingAttribute[],
  uid: string
) => ({
  type: MISSING_ATTRIBUTES_FOUND,
  missingAttributes: convertMissingAttributeListToObject(missingAttributeList),
  uid,
})

export function* persistProofRequestsSaga(): Generator<*, *, *> {
  try {
    const proofRequests = yield select(getProofRequests)
    yield call(secureSet, PROOF_REQUESTS, JSON.stringify(proofRequests))
  } catch (e) {
    console.log(`persistProofRequestsSaga: ${e}`)
  }
}

export function* hydrateProofRequestsSaga(): Generator<*, *, *> {
  try {
    const proofRequests: string = yield call(secureGet, PROOF_REQUESTS)
    if (proofRequests) {
      yield put(hydrateProofRequests(JSON.parse(proofRequests)))
    }
  } catch (e) {
    console.log(`hydrateProofRequestSaga: ${e}`)
  }
}

export function* proofAccepted(
  action: ProofRequestAcceptedAction
): Generator<*, *, *> {
  const { uid } = action
  const remoteDid: string = yield select(getProofRequestPairwiseDid, uid)
  const userPairwiseDid: string | null = yield select(
    getUserPairwiseDid,
    remoteDid
  )
  if (!userPairwiseDid) {
    yield put(
      sendProofFail(uid, {
        code: 'OCS-002',
        message: 'No pairwise connection found',
      })
    )
    return
  }

  const proofRequestPayload: ProofRequestPayload = yield select(
    getProofRequest,
    uid
  )
  const { proofHandle } = proofRequestPayload
  const connection: {
    remotePairwiseDID: string,
    remoteName: string,
  } & Connection = yield select(getRemotePairwiseDidAndName, userPairwiseDid)

  if (!connection.vcxSerializedConnection) {
    yield put(
      sendProofFail(uid, {
        code: 'OCS-002',
        message: 'No pairwise connection found',
      })
    )
    return
  }

  try {
    const connectionHandle: number = yield call(
      getHandleBySerializedConnection,
      connection.vcxSerializedConnection
    )
    yield call(sendProofApi, proofHandle, connectionHandle)
    yield put(sendProofSuccess(uid))
  } catch (e) {
    yield put(sendProofFail(uid, ERROR_SEND_PROOF(e.message)))
  }
}

export function* watchProofRequestAccepted(): any {
  yield takeLatest(PROOF_REQUEST_ACCEPTED, proofAccepted)
}

export function* watchPersistProofRequests(): any {
  yield takeEvery(
    [PROOF_REQUEST_SHOWN, PROOF_REQUEST_RECEIVED, PROOF_SERIALIZED],
    persistProofRequestsSaga
  )
}

export const proofRequestAutoFill = (
  uid: string,
  requestedAttributes: Array<Attribute>
) => ({
  type: PROOF_REQUEST_AUTO_FILL,
  uid,
  requestedAttributes,
})

export const proofRequestReceived = (
  payload: AdditionalProofDataPayload,
  payloadInfo: NotificationPayloadInfo
) => ({
  type: PROOF_REQUEST_RECEIVED,
  payload,
  payloadInfo,
})

export const proofSerialized = (serializedProof: string, uid: string) => ({
  type: PROOF_SERIALIZED,
  serializedProof,
  uid,
})

export function* serializeProofRequestSaga(
  action: ProofRequestReceivedAction
): Generator<*, *, *> {
  try {
    const { proofHandle } = action.payload
    const serializedProof: string = yield call(proofSerialize, proofHandle)
    yield put(proofSerialized(serializedProof, action.payloadInfo.uid))
  } catch (e) {
    // TODO:KS Add action for serialization failure
    // need to figure out what happens if serialization fails
    console.log('failed to serialize proof')
  }
}

export function* watchProofRequestReceived(): any {
  yield takeEvery(PROOF_REQUEST_RECEIVED, serializeProofRequestSaga)
}

export const updateProofHandle = (proofHandle: number, uid: string) => ({
  type: UPDATE_PROOF_HANDLE,
  proofHandle,
  uid,
})

export const proofRequestShowStart = (uid: string) => ({
  type: PROOF_REQUEST_SHOW_START,
  uid,
})

export default function proofRequestReducer(
  state: ProofRequestStore = proofRequestInitialState,
  action: ProofRequestAction
) {
  switch (action.type) {
    case PROOF_REQUEST_RECEIVED:
      return {
        ...state,
        [action.payloadInfo.uid]: {
          ...action.payload,
          ...action.payloadInfo,
          status: PROOF_REQUEST_STATUS.RECEIVED,
          proofStatus: PROOF_STATUS.NONE,
        },
      }

    case PROOF_REQUEST_SHOW_START:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.RECEIVED,
          proofStatus: PROOF_STATUS.NONE,
          missingAttributes: {},
        },
      }

    case PROOF_REQUEST_SHOWN:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.SHOWN,
        },
      }

    case PROOF_REQUEST_ACCEPTED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.ACCEPTED,
        },
      }

    case PROOF_REQUEST_IGNORED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.IGNORED,
        },
      }

    case PROOF_REQUEST_REJECTED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.REJECTED,
        },
      }

    case PROOF_REQUEST_AUTO_FILL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          data: {
            ...state[action.uid].data,
            requestedAttributes: [...action.requestedAttributes],
          },
        },
      }

    case SEND_PROOF:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofStatus: PROOF_STATUS.SENDING_PROOF,
        },
      }

    case SEND_PROOF_SUCCESS:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofStatus: PROOF_STATUS.SEND_PROOF_SUCCESS,
        },
      }

    case PROOF_FAIL:
    case SEND_PROOF_FAIL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofStatus: PROOF_STATUS.SEND_PROOF_FAIL,
        },
      }

    case MISSING_ATTRIBUTES_FOUND:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          missingAttributes: action.missingAttributes,
        },
      }
    case HYDRATE_PROOF_REQUESTS:
      return action.proofRequests

    case RESET:
      return proofRequestInitialState

    case PROOF_SERIALIZED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          vcxSerializedProofRequest: action.serializedProof,
        },
      }

    case UPDATE_PROOF_HANDLE:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofHandle: action.proofHandle,
        },
      }
    default:
      return state
  }
}

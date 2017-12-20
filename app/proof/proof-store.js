// @flow

import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import type {
  Proof,
  ProofStore,
  ProofAction,
  GenerateProofAction,
  ProofSuccessAction,
  ProofFailAction,
} from './type-proof'
import type { ProofRequestData } from '../proof-request/type-proof-request'
import { GENERATE_PROOF, PROOF_SUCCESS, PROOF_FAIL } from './type-proof'
import type { CustomError } from '../common/type-common'
import { prepareProof, generateProof } from '../bridge/react-native-cxs/RNCxs'
import { proofRequestAutoFill } from '../proof-request/proof-request-store'
import {
  getOriginalProofRequestData,
  getProofRequestPairwiseDid,
} from '../store/store-selector'

export const getProof = (uid: string) => ({
  type: GENERATE_PROOF,
  uid,
})

export const proofSuccess = (
  proof: Proof,
  uid: string
): ProofSuccessAction => ({
  type: PROOF_SUCCESS,
  proof,
  uid,
})

export const proofFail = (
  uid: string,
  error: CustomError
): ProofFailAction => ({
  type: PROOF_FAIL,
  uid,
  error,
})

export function* generateProofSaga(
  action: GenerateProofAction
): Generator<*, *, *> {
  try {
    const { uid } = action
    const proofRequest: ProofRequestData = yield select(
      getOriginalProofRequestData,
      uid
    )
    const remoteDid: string = yield select(getProofRequestPairwiseDid, uid)
    const preparedProof = yield call(prepareProof, JSON.stringify(proofRequest))

    // generate proof
    const preparedProofJSON = JSON.parse(preparedProof)
    const requestedAttrsJson = Object.keys(proofRequest.requested_attrs).reduce(
      (acc, attrKey) => ({
        ...acc,
        [attrKey]: [preparedProofJSON.attrs[attrKey][0].claim_uuid, true],
      }),
      {}
    )

    const requestedClaimsJson = {
      self_attested_attributes: {},
      requested_attrs: requestedAttrsJson,
      requested_predicates: {},
    }

    // call generate proof api
    const proofJson = yield call(
      generateProof,
      JSON.stringify(proofRequest),
      remoteDid,
      JSON.stringify(requestedClaimsJson),
      preparedProof
    )
    const proof = JSON.parse(proofJson)

    yield put(proofSuccess(proof, uid))

    // auto-fill proof request
    const { requested_attrs, name, version } = proofRequest
    const requestedAttributes = Object.keys(
      requested_attrs
    ).map(attributeKey => ({
      label: requested_attrs[attributeKey].name,
      value: proof.requested_proof.revealed_attrs[attributeKey][1],
    }))
    yield put(proofRequestAutoFill(uid, requestedAttributes))
  } catch (e) {
    yield put(proofFail(action.uid, e))
  }
}

export function* watchGenerateProof(): Generator<*, *, *> {
  yield takeLatest(GENERATE_PROOF, generateProofSaga)
}

export function* watchProof(): Generator<*, *, *> {
  yield all([watchGenerateProof()])
}

const initialState = {}

export default function proofReducer(
  state: ProofStore = initialState,
  action: ProofAction
) {
  switch (action.type) {
    case PROOF_SUCCESS: {
      return {
        ...state,
        [action.uid]: {
          ...action.proof,
        },
      }
    }

    case PROOF_FAIL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          error: action.error,
        },
      }

    default:
      return state
  }
}

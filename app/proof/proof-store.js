// @flow

import { put, takeLatest, take, call, all, select } from 'redux-saga/effects'
import type {
  Proof,
  ProofStore,
  UpdateAttributeClaimAction,
  ProofAction,
  GenerateProofAction,
  ProofSuccessAction,
  ProofFailAction,
  IndyPreparedProof,
  IndyRequestedAttributes,
  IndySelfAttestedAttributes,
  UserSelfAttestedAttributesAction,
  IndyRequestedProof,
  RequestedClaimsJson,
  RequestedAttrsJson,
} from './type-proof'
import type {
  ProofRequestData,
  SelfAttestedAttributes,
  MissingAttribute,
  IndySelfAttested,
  SelfAttestedAttribute,
  ProofRequestedAttributes,
} from '../proof-request/type-proof-request'
import {
  UPDATE_ATTRIBUTE_CLAIM,
  GENERATE_PROOF,
  PROOF_SUCCESS,
  PROOF_FAIL,
  ERROR_MISSING_ATTRIBUTE_IN_CLAIMS,
  USER_SELF_ATTESTED_ATTRIBUTES,
} from './type-proof'
import type { CustomError } from '../common/type-common'
import { prepareProof, generateProof } from '../bridge/react-native-cxs/RNCxs'
import {
  proofRequestAutoFill,
  missingAttributesFound,
  acceptProofRequest,
} from '../proof-request/proof-request-store'
import {
  getOriginalProofRequestData,
  getProofRequestPairwiseDid,
  getClaimIssuerLogo,
  getPoolConfig,
  getProofRequesterName,
} from '../store/store-selector'
import type { Attribute } from '../push-notification/type-push-notification'
import { RESET } from '../common/type-common'

export const updateAttributeClaim = (
  requestedAttrsJson: RequestedAttrsJson
): UpdateAttributeClaimAction => ({
  type: UPDATE_ATTRIBUTE_CLAIM,
  requestedAttrsJson,
})

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

export const userSelfAttestedAttributes = (
  selfAttestedAttributes: SelfAttestedAttributes,
  uid: string
) => ({
  type: USER_SELF_ATTESTED_ATTRIBUTES,
  selfAttestedAttributes,
  uid,
})

export function convertSelfAttestedToIndySelfAttested(
  selfAttestedAttributes: SelfAttestedAttributes
): IndySelfAttested {
  return Object.keys(selfAttestedAttributes).reduce((acc, name) => {
    const { key, data }: SelfAttestedAttribute = selfAttestedAttributes[name]
    return {
      ...acc,
      [key]: data,
    }
  }, {})
}

export function convertPreparedProofToRequestedAttributes(
  preparedProof: IndyPreparedProof,
  proofRequest: ProofRequestData
): [IndyRequestedAttributes, MissingAttribute[]] {
  // apart from conversion, it finds attributes that are not in any claim

  const missingAttributes: MissingAttribute[] = []
  const requestedAttributes = Object.keys(proofRequest.requested_attrs).reduce(
    (acc, attrKey) => {
      const attributeClaimData = preparedProof.attrs[attrKey]

      if (!attributeClaimData || !attributeClaimData[0]) {
        missingAttributes.push({
          key: attrKey,
          name: proofRequest.requested_attrs[attrKey].name,
        })

        return acc
      }

      return {
        ...acc,
        [attrKey]: [attributeClaimData[0].claim_uuid, true],
      }
    },
    {}
  )

  return [requestedAttributes, missingAttributes]
}

export function convertIndyPreparedProofToAttributes(
  preparedProof: IndyPreparedProof,
  requestedAttributes: ProofRequestedAttributes
): Array<Attribute> {
  let attributes = Object.keys(requestedAttributes).map(attributeKey => {
    const label = requestedAttributes[attributeKey].name
    const revealedAttributes = preparedProof.attrs[attributeKey]

    if (revealedAttributes && revealedAttributes.length > 0) {
      return revealedAttributes.map(revealedAttribute => ({
        label,
        data: revealedAttribute && revealedAttribute.attrs[label],
        claimUuid: revealedAttribute && revealedAttribute.claim_uuid,
      }))
    }

    const selfAttestedAttribute =
      preparedProof.self_attested_attrs &&
      preparedProof.self_attested_attrs[label.toLocaleLowerCase()].data

    return [
      {
        label,
        data: selfAttestedAttribute,
      },
    ]
  })

  // $FlowFixMe
  return attributes
}

export function* generateProofSaga(
  action: GenerateProofAction
): Generator<*, *, *> {
  try {
    const { uid } = action
    const proofRequest: ProofRequestData = yield select(
      getOriginalProofRequestData,
      uid
    )
    const poolConfig: string = yield select(getPoolConfig)

    const preparedProofJson: string = yield call(
      prepareProof,
      JSON.stringify(proofRequest),
      poolConfig
    )

    const preparedProof: IndyPreparedProof = JSON.parse(preparedProofJson)
    const [
      requestedAttrsJson,
      missingAttributes,
    ] = convertPreparedProofToRequestedAttributes(preparedProof, proofRequest)
    let selfAttestedAttributes: SelfAttestedAttributes = {}

    if (missingAttributes.length > 0) {
      // if we find that there are some attributes that are not available
      // in any of the claims stored in user wallet
      // then we ask user to fill in those attributes
      // so we need to tell proof request screen to ask user to
      yield put(missingAttributesFound(missingAttributes, uid))

      // once user has filled all attributes, we need to get those details here
      // user filled details become self attested attributes
      const selfAttestedFilledAction: UserSelfAttestedAttributesAction = yield take(
        USER_SELF_ATTESTED_ATTRIBUTES
      )
      selfAttestedAttributes = selfAttestedFilledAction.selfAttestedAttributes
    }

    const requestedClaimsJson = {
      self_attested_attributes: convertSelfAttestedToIndySelfAttested(
        selfAttestedAttributes
      ),
      requested_attrs: requestedAttrsJson,
      requested_predicates: {},
    }

    // auto-fill proof request
    const requestedAttributes = convertIndyPreparedProofToAttributes(
      { ...preparedProof, self_attested_attrs: { ...selfAttestedAttributes } },
      proofRequest.requested_attrs
    )

    yield put(proofRequestAutoFill(uid, requestedAttributes))

    const remoteDid: string = yield select(getProofRequestPairwiseDid, uid)

    const updateAttributeClaim = yield take(UPDATE_ATTRIBUTE_CLAIM)
    requestedClaimsJson.requested_attrs =
      updateAttributeClaim.requestedAttrsJson

    // call generate proof api
    const proofJson = yield call(
      generateProof,
      JSON.stringify(proofRequest),
      remoteDid,
      JSON.stringify(requestedClaimsJson),
      preparedProofJson,
      poolConfig
    )
    const proof: Proof = JSON.parse(proofJson)

    yield put(proofSuccess(proof, uid))
    yield put(acceptProofRequest(uid))
  } catch (e) {
    yield put(proofFail(action.uid, e))
  }
}

export function* watchGenerateProof(): any {
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

    case RESET:
      return initialState

    default:
      return state
  }
}

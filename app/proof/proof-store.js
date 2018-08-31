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
  VcxSelectedCredentials,
} from './type-proof'
import type {
  ProofRequestData,
  SelfAttestedAttributes,
  MissingAttribute,
  IndySelfAttested,
  SelfAttestedAttribute,
  ProofRequestedAttributes,
  ProofRequestPayload,
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
import {
  generateProof,
  getMatchingCredentials,
  proofDeserialize,
} from '../bridge/react-native-cxs/RNCxs'
import {
  proofRequestAutoFill,
  missingAttributesFound,
  acceptProofRequest,
  sendProof,
  updateProofHandle,
} from '../proof-request/proof-request-store'
import {
  getOriginalProofRequestData,
  getProofRequestPairwiseDid,
  getPoolConfig,
  getProofRequesterName,
  getProofRequest,
} from '../store/store-selector'
import type { Attribute } from '../push-notification/type-push-notification'
import { RESET } from '../common/type-common'
import { PROOF_REQUEST_SHOW_START } from '../proof-request/type-proof-request'

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
  const requestedAttributes = Object.keys(
    proofRequest.requested_attributes
  ).reduce((acc, attrKey) => {
    const attributeClaimData = preparedProof.attrs[attrKey]

    if (!attributeClaimData || !attributeClaimData[0]) {
      missingAttributes.push({
        key: attrKey,
        name: proofRequest.requested_attributes[attrKey].name,
      })

      return acc
    }

    return {
      ...acc,
      [attrKey]: [attributeClaimData[0].cred_info.referent, true],
    }
  }, {})

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
      return revealedAttributes.map(revealedAttribute => {
        // convert attrs props to lowercase
        // maintain a mapping that will map case insensitive name to actual name in `attrs`
        let caseInsensitiveMap = null
        if (revealedAttribute) {
          caseInsensitiveMap = Object.keys(
            revealedAttribute.cred_info.attrs
          ).reduce(
            (acc, attributeName) => ({
              ...acc,
              [attributeName.toLowerCase()]: attributeName,
            }),
            {}
          )
        }

        return {
          label,
          key: attributeKey,
          data:
            revealedAttribute &&
            caseInsensitiveMap &&
            revealedAttribute.cred_info.attrs[
              caseInsensitiveMap[label.toLowerCase()]
            ],
          claimUuid: revealedAttribute && revealedAttribute.cred_info.referent,
          // TODO:KS Refactor this logic to not put cred_info here
          // We are putting cred_info here because we don't want to iterate
          // later to find whole credential
          cred_info: revealedAttribute ? revealedAttribute : null,
        }
      })
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

export function convertUserSelectedCredentialToVcxSelectedCredentials(
  userSelectedCredentials: IndyRequestedAttributes
): VcxSelectedCredentials {
  const attrs = Object.keys(userSelectedCredentials).reduce(
    (acc, attributeKey) => ({
      ...acc,
      [attributeKey]: userSelectedCredentials[attributeKey][2],
    }),
    {}
  )

  if (Object.keys(attrs).length === 0) {
    return {}
  }

  return {
    attrs,
  }
}

export function convertSelectedCredentialAttributesToIndyProof(
  userSelectedCredentials: IndyRequestedAttributes
) {
  const credentialFilledAttributes = Object.keys(userSelectedCredentials)

  return credentialFilledAttributes.reduce((acc, attributeKey) => {
    const selectedAttribute = userSelectedCredentials[attributeKey]
    // we only have attribute key at this point, we can still get attribute name
    // but then we would have to do a lot of other mapping
    // we should still do that but for now we know that attribute keys are formed
    // by adding _<index> after the name of attribute
    // so we are removing that last _<index> from attribute key and generating attribute name
    // We will remove this logic and have it work without below hack
    // when we will refactor whole proof generation logic
    const caseInsensitiveMap = Object.keys(
      selectedAttribute[2].cred_info.attrs
    ).reduce(
      (acc, attributeName) => ({
        ...acc,
        [attributeName.toLowerCase()]: attributeName,
      }),
      {}
    )
    let attributeLabel = attributeKey.split('_')
    if (attributeLabel.length > 1) {
      attributeLabel = attributeLabel.slice(0, -1)
    }
    attributeLabel = attributeLabel.join('_')
    return {
      ...acc,
      [attributeKey]: [
        selectedAttribute[0],
        selectedAttribute[2].cred_info.attrs[
          caseInsensitiveMap[attributeLabel.toLowerCase()]
        ],
      ],
    }
  }, {})
}

export function* generateProofSaga(
  action: GenerateProofAction
): Generator<*, *, *> {
  try {
    const { uid } = action
    const proofRequestPayload: ProofRequestPayload = yield select(
      getProofRequest,
      uid
    )
    const proofRequest = proofRequestPayload.originalProofRequestData
    let proofHandle = proofRequestPayload.proofHandle
    let matchingCredentialsJson: string | null = null

    try {
      matchingCredentialsJson = yield call(getMatchingCredentials, proofHandle)
    } catch (e) {
      // the reason why are we doing this here is
      // we persist proofHandle along with proof request
      // proofHandle is given by vcx for the their internal object which is in memory
      // and using that proofHandle we can query data
      // However, if user kills the app, then vcx looses all in memory object
      // and proofHandle that we persisted no longer points to proof object
      // so we catch that exception here and we get new proofHandle
      // and then try to query data again
      // if it fails again, then there must be some error from vcx side which we bubble up

      // the way we achieve what is written above is that we take the serialized proof request
      // from vcx and store that object on our side and then we pass that serialized object
      // back to vcx, so that vcx can create it's internal proof object again
      const serializedProofRequest =
        proofRequestPayload.vcxSerializedProofRequest
      if (serializedProofRequest) {
        // it might happen that we won't have serialized proof request
        // so we guard against it and let fail
        proofHandle = yield call(proofDeserialize, serializedProofRequest)
        // update proof handle in store, because it would be used by proof-request store
        yield put(updateProofHandle(proofHandle, uid))
        matchingCredentialsJson = yield call(
          getMatchingCredentials,
          proofHandle
        )
      }
    }

    if (!matchingCredentialsJson) {
      throw new Error('No matching credential json result')
    }

    const matchingCredentials: IndyPreparedProof = JSON.parse(
      matchingCredentialsJson
    )
    const [
      requestedAttrsJson,
      missingAttributes,
    ] = convertPreparedProofToRequestedAttributes(
      matchingCredentials,
      proofRequest
    )
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

    // auto-fill proof request
    const requestedAttributes = convertIndyPreparedProofToAttributes(
      {
        ...matchingCredentials,
        self_attested_attrs: { ...selfAttestedAttributes },
      },
      proofRequest.requested_attributes
    )
    yield put(proofRequestAutoFill(uid, requestedAttributes))

    const updateAttributeClaim = yield take(UPDATE_ATTRIBUTE_CLAIM)

    yield put(sendProof(uid))

    const selectedCredentials = convertUserSelectedCredentialToVcxSelectedCredentials(
      updateAttributeClaim.requestedAttrsJson
    )
    const selectedSelfAttestedAttributes = convertSelfAttestedToIndySelfAttested(
      selfAttestedAttributes
    )
    yield call(
      generateProof,
      proofHandle,
      JSON.stringify(selectedCredentials),
      JSON.stringify(selectedSelfAttestedAttributes)
    )

    yield put(acceptProofRequest(uid))
    // create a proof object so that history store and others that depend on proof
    // can use this proof object, previously proof object was generated with libIndy
    // now that we have removed libIndy and use vcx, we are generating this object
    // We should re-write whole proof generation logic and events in a single saga
    // and merge two stores proof-request-store and proof-store
    const proof: Proof = {
      proofs: {},
      aggregated_proof: {
        c_hash: '',
        c_list: [[0]],
      },
      requested_proof: {
        revealed_attrs: convertSelectedCredentialAttributesToIndyProof(
          updateAttributeClaim.requestedAttrsJson
        ),
        unrevealed_attrs: {},
        self_attested_attrs: selectedSelfAttestedAttributes,
        predicates: {},
      },
    }
    yield put(proofSuccess(proof, uid))
  } catch (e) {
    yield put(proofFail(action.uid, e))
  }
}

export function* watchGenerateProof(): any {
  yield takeLatest(GENERATE_PROOF, generateProofSaga)
}

export function* watchProof(): any {
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

    case PROOF_REQUEST_SHOW_START: {
      return {
        ...state,
        [action.uid]: undefined,
      }
    }

    case RESET:
      return initialState

    default:
      return state
  }
}

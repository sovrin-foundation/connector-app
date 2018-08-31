// @flow
import renderer from 'react-test-renderer'
import { put, call, select, take } from 'redux-saga/effects'
import { initialTestAction } from '../../common/type-common'
import proofReducer, {
  proofSuccess,
  generateProofSaga,
  convertPreparedProofToRequestedAttributes,
  convertSelfAttestedToIndySelfAttested,
  proofFail,
  convertIndyPreparedProofToAttributes,
  getProof,
} from '../proof-store'
import {
  acceptProofRequest,
  missingAttributesFound,
  proofRequestAutoFill,
  sendProof,
  proofRequestShowStart,
} from '../../proof-request/proof-request-store'
import { generateProof } from '../../bridge/react-native-cxs/RNCxs'
import {
  proofRequest,
  proofRequest10Attributes,
  proof,
  proofWithMissingAttributes,
  proofWith10Attributes,
  originalProofRequestData,
  originalProofRequestData10Attributes,
  originalProofRequestDataMissingAttribute,
  preparedProof,
  homeAddressPreparedProof,
  preparedProofWithMissingAttribute,
  homeAddressPreparedProofWithMissingAttribute,
  selfAttestedAttributes,
  selfAttestedAttributes1,
  poolConfig,
} from '../../../__mocks__/static-data'
import {
  getOriginalProofRequestData,
  getProofRequestPairwiseDid,
  getPoolConfig,
} from '../../store/store-selector'
import {
  USER_SELF_ATTESTED_ATTRIBUTES,
  UPDATE_ATTRIBUTE_CLAIM,
} from '../type-proof'
import { PROOF_REQUEST_SHOW_START } from '../../proof-request/type-proof-request'

describe('Proof Store', () => {
  const remoteDid = proofRequest.payloadInfo.remotePairwiseDID
  const uid = proofRequest.payloadInfo.uid

  let initialState
  let afterProofSuccess
  beforeEach(() => {
    initialState = proofReducer(undefined, initialTestAction())
    afterProofSuccess = proofReducer(initialState, proofSuccess(proof, uid))
  })

  it('should match snapshot for proof received action', () => {
    expect(afterProofSuccess).toMatchSnapshot()
  })

  it('should convert prepared proof to indy proof format', () => {
    expect(
      convertPreparedProofToRequestedAttributes(
        preparedProof,
        originalProofRequestData
      )
    ).toMatchSnapshot()
  })

  it('should find missing attributes if any missing', () => {
    expect(
      convertPreparedProofToRequestedAttributes(
        preparedProofWithMissingAttribute,
        originalProofRequestDataMissingAttribute
      )
    ).toMatchSnapshot()
  })

  it('match snapshot while converting SelfAttestedAttributes to Indy format', () => {
    expect(
      convertSelfAttestedToIndySelfAttested(selfAttestedAttributes)
    ).toMatchSnapshot()
    expect(
      convertSelfAttestedToIndySelfAttested(selfAttestedAttributes1)
    ).toMatchSnapshot()
  })

  it('fn:convertPreparedProofToRequestedAttributes', () => {
    expect(
      convertIndyPreparedProofToAttributes(
        homeAddressPreparedProof,
        originalProofRequestData.requested_attributes
      )
    ).toMatchSnapshot()
    expect(
      convertIndyPreparedProofToAttributes(
        homeAddressPreparedProof,
        originalProofRequestData10Attributes.requested_attributes
      )
    ).toMatchSnapshot()
  })

  it('store update correctly if proof fails', () => {
    expect(
      proofReducer(
        initialState,
        proofFail(uid, {
          code: 'TEST-CODE',
          message: 'test error message',
        })
      )
    ).toMatchSnapshot()
  })

  // TODO:KS Fix these tests before July 25
  xit('generate proof saga should generate proof', () => {
    const gen = generateProofSaga(getProof(uid))
    expect(gen.next().value).toEqual(select(getOriginalProofRequestData, uid))

    expect(gen.next(originalProofRequestData).value).toEqual(
      select(getPoolConfig)
    )

    const preparedProofJson = JSON.stringify(homeAddressPreparedProof)
    const requestedClaimsJson = {
      self_attested_attributes: {},
      requested_attrs: convertPreparedProofToRequestedAttributes(
        homeAddressPreparedProof,
        originalProofRequestData
      )[0],
      requested_predicates: {},
    }

    const requestedAttributes = convertIndyPreparedProofToAttributes(
      {
        ...homeAddressPreparedProof,
        self_attested_attrs: {},
      },
      originalProofRequestData.requested_attributes
    )

    expect(gen.next(preparedProofJson).value).toEqual(
      put(proofRequestAutoFill(uid, requestedAttributes))
    )

    expect(gen.next().value).toEqual(select(getProofRequestPairwiseDid, uid))

    expect(gen.next(remoteDid).value).toEqual(take(UPDATE_ATTRIBUTE_CLAIM))

    expect(
      gen.next({
        type: UPDATE_ATTRIBUTE_CLAIM,
        requestedAttrsJson: requestedClaimsJson.requested_attrs,
      }).value
    ).toEqual(put(sendProof(uid)))

    expect(gen.next(JSON.stringify(proof)).value).toEqual(
      put(proofSuccess(proof, uid))
    )

    expect(gen.next().value).toEqual(put(acceptProofRequest(uid)))

    expect(gen.next().done).toBe(true)
  })

  // TODO:KS Fix this tests before July 25
  xit('generate proof saga should work fine with missing attributes', () => {
    const gen = generateProofSaga(getProof(uid))
    expect(gen.next().value).toEqual(select(getOriginalProofRequestData, uid))

    expect(gen.next(originalProofRequestDataMissingAttribute).value).toEqual(
      select(getPoolConfig)
    )

    const preparedProofJson = JSON.stringify(
      homeAddressPreparedProofWithMissingAttribute
    )
    const [
      requestedAttributesJson,
      missingAttributes,
    ] = convertPreparedProofToRequestedAttributes(
      homeAddressPreparedProofWithMissingAttribute,
      originalProofRequestDataMissingAttribute
    )

    expect(gen.next(preparedProofJson).value).toEqual(
      put(missingAttributesFound(missingAttributes, uid))
    )

    expect(gen.next(preparedProofJson).value).toEqual(
      take(USER_SELF_ATTESTED_ATTRIBUTES)
    )

    const requestedClaimsJson = {
      self_attested_attributes: convertSelfAttestedToIndySelfAttested(
        selfAttestedAttributes
      ),
      requested_attrs: requestedAttributesJson,
      requested_predicates: {},
    }

    const requestedAttributes = convertIndyPreparedProofToAttributes(
      {
        ...homeAddressPreparedProofWithMissingAttribute,
        self_attested_attrs: { ...selfAttestedAttributes },
      },
      originalProofRequestDataMissingAttribute.requested_attributes
    )

    expect(
      gen.next({
        type: USER_SELF_ATTESTED_ATTRIBUTES,
        selfAttestedAttributes,
        uid,
      }).value
    ).toEqual(put(proofRequestAutoFill(uid, requestedAttributes)))

    expect(gen.next().value).toEqual(select(getProofRequestPairwiseDid, uid))

    expect(gen.next(remoteDid).value).toEqual(take(UPDATE_ATTRIBUTE_CLAIM))

    expect(
      gen.next({
        type: UPDATE_ATTRIBUTE_CLAIM,
        requestedAttrsJson: requestedClaimsJson.requested_attrs,
      }).value
    ).toEqual(put(sendProof(uid)))

    expect(gen.next(JSON.stringify(proof)).value).toEqual(
      put(proofSuccess(proof, uid))
    )

    expect(gen.next().value).toEqual(put(acceptProofRequest(uid)))

    expect(gen.next().done).toBe(true)
  })

  it('should reset proof store, if RESET action is raised', () => {
    expect(proofReducer(afterProofSuccess, { type: 'RESET' })).toMatchSnapshot()
  })

  it('proof store should reset for a given proof request if PROOF_REQUEST_SHOW_START is raised', () => {
    const proofStateAfterFail = proofReducer(
      initialState,
      proofFail(uid, {
        code: 'TEST-CODE',
        message: 'test error message',
      })
    )
    expect(
      proofReducer(proofStateAfterFail, proofRequestShowStart(uid))
    ).toMatchSnapshot()
  })
})

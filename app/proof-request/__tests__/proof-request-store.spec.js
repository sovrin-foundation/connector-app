// @flow
import { put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import proofRequestStore, {
  proofRequestReceived,
  ignoreProofRequest,
  rejectProofRequest,
  acceptProofRequest,
  proofRequestShown,
  sendProof,
  sendProofSuccess,
  sendProofFail,
  proofAccepted,
  convertMissingAttributeListToObject,
  missingAttributesFound,
  proofRequestAutoFill,
  proofRequestShowStart,
} from '../proof-request-store'
import { INITIAL_TEST_ACTION } from '../../common/type-common'
import {
  getProofRequestPairwiseDid,
  getUserPairwiseDid,
  getAgencyUrl,
  getProof,
  getUserOneTimeInfo,
  getAgencyVerificationKey,
  getRemotePairwiseDidAndName,
  getPoolConfig,
} from '../../store/store-selector'

import { MESSAGE_TYPE } from '../../api/api-constants'
import {
  proofRequest,
  proofRequestId as uid,
  poolConfig,
  missingAttributes,
  missingAttributes1,
  fulfilledRequestedAttributes,
} from '../../../__mocks__/static-data'

describe('proof request store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState = {}
  let newState

  it('should correctly calculate initial state', () => {
    initialState = proofRequestStore(undefined, initialAction)
    expect(initialState).toMatchSnapshot()
  })

  it('proof request is received', () => {
    newState = proofRequestStore(
      initialState,
      proofRequestReceived(proofRequest.payload, proofRequest.payloadInfo)
    )
    expect(newState).toMatchSnapshot()
  })

  it('proof request is shown', () => {
    newState = proofRequestStore(newState, proofRequestShown(uid))
    expect(newState).toMatchSnapshot()
  })

  it('proof request is ignored', () => {
    newState = proofRequestStore(newState, ignoreProofRequest(uid))
    expect(newState).toMatchSnapshot()
  })

  it('proof request is rejected', () => {
    newState = proofRequestStore(newState, rejectProofRequest(uid))
    expect(newState).toMatchSnapshot()
  })

  it('proof request is accepted', () => {
    newState = proofRequestStore(newState, acceptProofRequest(uid))
    expect(newState).toMatchSnapshot()
  })

  it('proof request is ignored', () => {
    newState = proofRequestStore(newState, ignoreProofRequest(uid))
    expect(newState).toMatchSnapshot()
  })

  it('sending proof', () => {
    newState = proofRequestStore(newState, sendProof(uid))
    expect(newState).toMatchSnapshot()
  })

  it('sending proof success', () => {
    newState = proofRequestStore(newState, sendProofSuccess(uid))
    expect(newState).toMatchSnapshot()
  })

  it('sending proof failed', () => {
    newState = proofRequestStore(
      newState,
      sendProofFail(uid, {
        code: 'OCS-002',
        message: 'No pairwise connection found',
      })
    )
    expect(newState).toMatchSnapshot()
  })

  it('ACTION: MISSING_ATTRIBUTES_FOUND', () => {
    expect(
      proofRequestStore(
        newState,
        missingAttributesFound(missingAttributes, uid)
      )
    ).toMatchSnapshot()
  })

  it('ACTION: PROOF_REQUEST_AUTO_FILL', () => {
    expect(
      proofRequestStore(
        newState,
        proofRequestAutoFill(uid, fulfilledRequestedAttributes)
      )
    ).toMatchSnapshot()
  })

  it('should convert missing attributes to self attested attributes', () => {
    expect(
      convertMissingAttributeListToObject(missingAttributes)
    ).toMatchSnapshot()
    expect(
      convertMissingAttributeListToObject(missingAttributes1)
    ).toMatchSnapshot()
  })

  it('should reset proof request store, if RESET action is raised', () => {
    expect(proofRequestStore(newState, { type: 'RESET' })).toMatchSnapshot()
  })

  it('ACTION: PROOF_REQUEST_SHOWN, after missing attributes were found', () => {
    const afterMissingAttributesState = proofRequestStore(
      newState,
      missingAttributesFound(missingAttributes, uid)
    )
    expect(
      proofRequestStore(newState, proofRequestShowStart(uid))
    ).toMatchSnapshot()
  })
})

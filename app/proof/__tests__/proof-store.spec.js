// @flow
import renderer from 'react-test-renderer'
import { put, call } from 'redux-saga/effects'
import { initialTestAction } from '../../common/type-common'
import proofReducer, { proofSuccess } from '../proof-store'
import { acceptProofRequest } from '../../proof-request/proof-request-store'
import {
  prepareProof,
  generateProof,
} from '../../bridge/react-native-cxs/RNCxs'
import { proofRequest, proof } from '../../../__mocks__/static-data'

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

  xit('show fail if attributes are missing from claims', () => {
    // TODO:KS Add implementation once connection history test related
    // changes are available, want to avoid bit of rework
  })
})

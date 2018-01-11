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

describe('Proof Store', () => {
  const proofRequest = {
    nonce: '123432421212',
    name: 'proof_req_1',
    version: '0.1',
    requested_attrs: {
      attr1_uuid: {
        schema_seq_no: 103,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
        name: 'name',
      },
    },
    requested_predicates: {},
  }
  const remoteDid = 'LXemRr9feto7vMRcaoby7f'
  const uid = '1234'

  let initialState
  let afterProofSuccess
  beforeEach(() => {
    initialState = proofReducer(undefined, initialTestAction())
    afterProofSuccess = proofReducer(
      initialState,
      proofSuccess(proofRequest, uid)
    )
  })

  it('should match snapshot for proof received action', () => {
    expect(afterProofSuccess).toMatchSnapshot()
  })

  xit('show fail if attributes are missing from claims', () => {
    // TODO:KS Add implementation once connection history test related
    // changes are available, want to avoid bit of rework
  })
})

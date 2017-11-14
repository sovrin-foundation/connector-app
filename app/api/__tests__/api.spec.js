// @flow
import renderer from 'react-test-renderer'
import { convertClaimRequestToEdgeClaimRequest } from '../api'

describe('convertClaimRequestToEdgeClaimRequest', () => {
  it('should convert correctly', () => {
    const edgeClaimRequest = convertClaimRequestToEdgeClaimRequest({
      blinded_ms: {
        prover_did: 'userPairwiseDid',
        u: 'u',
        ur: 'ur',
      },
      schema_seq_no: 12,
      issuer_did: 'issuer_did',
      remoteDid: 'remoteDid',
      userPairwiseDid: 'userPairwiseDid',
    })
    expect(edgeClaimRequest).toMatchSnapshot()
  })
})

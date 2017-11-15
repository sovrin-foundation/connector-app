// @flow
import { put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import proofRequestStore, { proofRequestReceived } from '../proof-request-store'
import { INITIAL_TEST_ACTION } from '../../common/type-common'

describe('proof request store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState = {}

  const proofRequest = {
    payload: {
      data: {
        name: 'Home Address',
        version: '1.0.0',
        revealedAttributes: [
          {
            label: 'Address 1',
          },
          {
            label: 'Address 2',
          },
        ],
      },
      issuer: {
        name: 'Test Issuer',
        did: 'issuerDid',
      },
      statusMsg: 'pending',
    },
    payloadInfo: {
      uid: 'usd123',
      senderLogoUrl: 'http://testissuer.com/logoUrl.png',
      remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
    },
  }

  it('should correctly calculate initial state', () => {
    initialState = proofRequestStore(undefined, initialAction)
    expect(initialState).toMatchSnapshot()
  })

  it('proof request is received', () => {
    expect(
      proofRequestStore(
        initialState,
        proofRequestReceived(proofRequest.payload, proofRequest.payloadInfo)
      )
    ).toMatchSnapshot()
  })
})

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
import { sendMessage } from '../../bridge/react-native-cxs/RNCxs'
import {
  proofRequest,
  proofRequestId as uid,
  poolConfig,
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

  it('proofAccepted saga works fine after proof request is accepted', () => {
    const payload = {
      requested: {
        attr1_uuid: ['claim_proof1_uuid', 'Address 1', '234234324324324324'],
        attr2_uuid: ['claim_proof2_uuid', 'Address 2', '324324324324234234'],
      },
      claim_proofs: {
        claim_proof1_uuid: ['<claim_proof>', 'V4SGRU86Z58d6TV7PBUe6f', '2'],
      },
      aggregated_proof: '<aggregated_proof>',
    }
    const gen = proofAccepted(acceptProofRequest(uid))

    expect(gen.next().value).toEqual(select(getProofRequestPairwiseDid, uid))
    const remoteDid = proofRequest.payloadInfo.remotePairwiseDID

    expect(gen.next(remoteDid).value).toEqual(
      select(getUserPairwiseDid, remoteDid)
    )

    const userPairwiseDid = 'userPairwiseDID1'
    expect(gen.next(userPairwiseDid).value).toEqual(put(sendProof(uid)))
    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'https://agencyUrl.com'
    expect(gen.next(agencyUrl).value).toEqual(select(getPoolConfig))

    expect(gen.next(poolConfig).value).toEqual(select(getProof, uid))
    const proof = {
      ...payload,
      remoteDid,
      userPairwiseDid,
    }

    expect(gen.next(payload).value).toEqual(select(getAgencyVerificationKey))

    const agencyVerificationKey = 'agencyVerificationKey'
    expect(gen.next(agencyVerificationKey).value).toEqual(
      select(getRemotePairwiseDidAndName, userPairwiseDid)
    )

    const connection = {
      identifier: userPairwiseDid,
      senderDID: remoteDid,
      myPairwiseDid: userPairwiseDid,
      myPairwiseVerKey: 'myPairwiseVerKey',
      myPairwiseAgentDid: 'myPairwiseAgentDid',
      myPairwiseAgentVerKey: 'myPairwiseAgentVerKey',
      myPairwisePeerVerKey: 'myPairwisePeerVerKey',
    }
    expect(gen.next(connection).value).toEqual(select(getUserOneTimeInfo))

    const userOneTimeInfo = {
      oneTimeAgencyDid: 'oneTimeAgencyDid',
      oneTimeAgencyVerificationKey: 'oneTimeAgencyVerificationKey',
      myOneTimeDid: 'myOneTimeDid',
      myOneTimeVerificationKey: 'myOneTimeVerificationKey',
      myOneTimeAgentDid: 'myOneTimeAgentDid',
      myOneTimeAgentVerificationKey: 'myOneTimeAgentVerificationKey',
    }
    const url = `${agencyUrl}/agency/msg`
    expect(gen.next(userOneTimeInfo).value).toEqual(
      call(sendMessage, {
        url,
        messageType: MESSAGE_TYPE.PROOF,
        messageReplyId: uid,
        message: JSON.stringify(proof),
        myPairwiseDid: connection.myPairwiseDid,
        myPairwiseVerKey: connection.myPairwiseVerKey,
        myPairwiseAgentDid: connection.myPairwiseAgentDid,
        myPairwiseAgentVerKey: connection.myPairwiseAgentVerKey,
        myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
        myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
        myOneTimeDid: userOneTimeInfo.myOneTimeDid,
        myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
        myAgencyVerKey: agencyVerificationKey,
        myPairwisePeerVerKey: connection.myPairwisePeerVerKey,
        poolConfig,
      })
    )

    // if message id matches then, saga should stop and put success action
    expect(gen.next().value).toMatchObject(put(sendProofSuccess(uid)))

    expect(gen.next().done).toBe(true)
  })
})

// @flow
import { put, call, select, race, take } from 'redux-saga/effects'
import claimOfferStore, {
  claimOfferReceived,
  claimOfferShown,
  claimOfferIgnored,
  claimOfferRejected,
  sendClaimRequest,
  claimRequestSuccess,
  claimRequestFail,
  claimOfferAccepted,
  acceptClaimOffer,
  convertClaimRequestToEdgeClaimRequest,
} from '../claim-offer-store'
import { CLAIM_OFFER_ACCEPTED } from '../type-claim-offer'
import { INITIAL_TEST_ACTION } from '../../common/type-common'
import type { ClaimOfferAcceptedAction } from '../type-claim-offer'
import {
  getClaimOffer,
  getUserPairwiseDid,
  getAgencyUrl,
  getUserOneTimeInfo,
  getAgencyVerificationKey,
  getRemotePairwiseDidAndName,
  getPoolConfig,
} from '../../store/store-selector'
import {
  generateClaimRequest,
  sendMessage,
} from '../../bridge/react-native-cxs/RNCxs'
import {
  CLAIM_STORAGE_FAIL,
  CLAIM_STORAGE_SUCCESS,
} from '../../claim/type-claim'
import { MESSAGE_TYPE } from '../../api/api-constants'
import {
  claimOffer,
  claimOfferId as uid,
  pairwiseConnection,
  claimRequest,
  poolConfig,
} from '../../../__mocks__/static-data'

describe('claim offer store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState = {}
  let newState = {}

  beforeEach(() => {
    initialState = claimOfferStore(undefined, initialAction)
  })

  it('should correctly calculate initial state', () => {
    expect(initialState).toMatchSnapshot()
  })

  it('claim offer is received', () => {
    newState = claimOfferStore(
      initialState,
      claimOfferReceived(claimOffer.payload, claimOffer.payloadInfo)
    )
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is shown', () => {
    newState = claimOfferStore(newState, claimOfferShown(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is ignored', () => {
    newState = claimOfferStore(newState, claimOfferIgnored(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is rejected', () => {
    newState = claimOfferStore(newState, claimOfferRejected(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim offer is accepted', () => {
    newState = claimOfferStore(newState, acceptClaimOffer(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request is sent', () => {
    newState = claimOfferStore(newState, sendClaimRequest(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request is success', () => {
    newState = claimOfferStore(newState, claimRequestSuccess(uid))
    expect(newState).toMatchSnapshot()
  })

  it('claim request is fail', () => {
    newState = claimOfferStore(
      newState,
      claimRequestFail(uid, {
        code: 'TEST-100',
        message: 'Claim request failed',
      })
    )
    expect(newState).toMatchSnapshot()
  })

  it('claim request saga works fine after claim offer is accepted', () => {
    const afterClaimOfferReceived = {
      ...claimOffer.payload,
      ...claimOffer.payloadInfo,
    }
    const gen = claimOfferAccepted(acceptClaimOffer(uid))

    expect(gen.next().value).toEqual(select(getClaimOffer, uid))

    const remoteDid = claimOffer.payloadInfo.remotePairwiseDID
    expect(gen.next(afterClaimOfferReceived).value).toEqual(
      select(getUserPairwiseDid, remoteDid)
    )

    const userPairwiseDid = pairwiseConnection.identifier
    expect(gen.next(userPairwiseDid).value).toEqual(put(sendClaimRequest(uid)))
    expect(gen.next().value).toEqual(select(getAgencyUrl))

    const agencyUrl = 'https://agencyUrl.com'
    expect(gen.next(agencyUrl).value).toEqual(select(getPoolConfig))

    const expectedIndyClaimOffer = {
      issuerDid: claimOffer.payload.issuer.did,
      schemaSequenceNumber:
        claimOffer.payload.data.claimDefinitionSchemaSequenceNumber,
    }
    expect(gen.next(poolConfig).value).toEqual(
      call(generateClaimRequest, remoteDid, expectedIndyClaimOffer, poolConfig)
    )

    const claimRequest = {
      blinded_ms: {
        prover_did: userPairwiseDid,
        u: 'u',
        ur: 'ur',
      },
      schema_seq_no: 12,
      issuer_did: 'issuer_did',
    }

    expect(gen.next(JSON.stringify(claimRequest)).value).toEqual(
      select(getUserOneTimeInfo)
    )

    const userOneTimeInfo = {
      oneTimeAgencyDid: 'oneTimeAgencyDid',
      oneTimeAgencyVerificationKey: 'oneTimeAgencyVerificationKey',
      myOneTimeDid: 'myOneTimeDid',
      myOneTimeVerificationKey: 'myOneTimeVerificationKey',
      myOneTimeAgentDid: 'myOneTimeAgentDid',
      myOneTimeAgentVerificationKey: 'myOneTimeAgentVerificationKey',
    }
    expect(gen.next(userOneTimeInfo).value).toEqual(
      select(getAgencyVerificationKey)
    )

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

    const url = `${agencyUrl}/agency/msg`
    const expectedData = {
      url,
      messageType: MESSAGE_TYPE.CLAIM_REQUEST,
      messageReplyId: uid,
      message: JSON.stringify(
        convertClaimRequestToEdgeClaimRequest({
          ...claimRequest,
          remoteDid,
          userPairwiseDid,
        })
      ),
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
    }

    expect(gen.next(connection).value).toEqual(call(sendMessage, expectedData))

    expect(gen.next().value).toEqual(
      race({
        success: take(CLAIM_STORAGE_SUCCESS),
        fail: take(CLAIM_STORAGE_FAIL),
      })
    )

    // race should go on if message id does not match
    expect(
      gen.next({ success: { messageId: 'non matching' } }).value
    ).toMatchObject(
      race({
        success: take(CLAIM_STORAGE_SUCCESS),
        fail: take(CLAIM_STORAGE_FAIL),
      })
    )

    // if message id matches then, saga should stop and put success action
    expect(gen.next({ success: { messageId: uid } }).value).toMatchObject(
      put(claimRequestSuccess(uid))
    )

    expect(gen.next().done).toBe(true)
  })
})

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

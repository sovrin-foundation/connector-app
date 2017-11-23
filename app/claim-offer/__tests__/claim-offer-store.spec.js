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
} from '../claim-offer-store'
import { CLAIM_OFFER_ACCEPTED } from '../type-claim-offer'
import { INITIAL_TEST_ACTION } from '../../common/type-common'
import type { ClaimOfferAcceptedAction } from '../type-claim-offer'
import {
  getClaimOffer,
  getUserPairwiseDid,
  getAgencyUrl,
} from '../../store/store-selector'
import { generateClaimRequest } from '../../bridge/react-native-cxs/RNCxs'
import { sendClaimRequest as sendClaimRequestApi } from '../../api/api'
import {
  CLAIM_STORAGE_FAIL,
  CLAIM_STORAGE_SUCCESS,
} from '../../claim/type-claim'

describe('claim offer store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState = {}
  let newState = {}
  const uid = 'usd123'

  const claimOffer = {
    payload: {
      data: {
        name: 'Home Address',
        version: '1.0.0',
        revealedAttributes: [
          {
            label: 'Address 1',
            data: 'Address Address Address',
          },
          {
            label: 'Address 2',
            data: 'Address 2 Address 2 Address 2',
          },
        ],
        claimDefinitionSchemaSequenceNumber: 36,
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

    const userPairwiseDid = 'userPairwiseDID1'
    expect(gen.next(userPairwiseDid).value).toEqual(put(sendClaimRequest(uid)))
    expect(gen.next().value).toEqual(select(getAgencyUrl))

    const agencyUrl = 'https://agencyUrl.com'
    const expectedIndyClaimOffer = {
      issuerDid: claimOffer.payload.issuer.did,
      schemaSequenceNumber:
        claimOffer.payload.data.claimDefinitionSchemaSequenceNumber,
    }
    expect(gen.next(agencyUrl).value).toEqual(
      call(generateClaimRequest, remoteDid, expectedIndyClaimOffer)
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
    const expectedApiData = {
      claimRequest: {
        ...claimRequest,
        remoteDid,
        userPairwiseDid,
      },
      agencyUrl,
      userPairwiseDid,
      responseMsgId: uid,
    }
    expect(gen.next(JSON.stringify(claimRequest)).value).toEqual(
      call(sendClaimRequestApi, expectedApiData)
    )

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

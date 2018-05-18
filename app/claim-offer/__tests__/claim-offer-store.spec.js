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
  addSerializedClaimOffer,
  hydrateSerializedClaimOffers,
  saveSerializedClaimOffersSaga,
  removePersistedSerializedClaimOffersSaga,
  hydrateSerializedClaimOffersSaga,
  saveSerializedClaimOffer,
  claimOfferAcceptedVcx,
} from '../claim-offer-store'
import {
  CLAIM_OFFER_ACCEPTED,
  KEY_SERIALIZED_CLAIM_OFFERS,
  SAVE_SERIALIZED_CLAIM_OFFERS_SUCCESS,
  SAVE_SERIALIZED_CLAIM_OFFERS_FAIL,
  ERROR_SAVE_SERIALIZED_CLAIM_OFFERS,
  REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS,
} from '../type-claim-offer'
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
  serializeClaimOffer,
  getHandleBySerializedConnection,
  getClaimHandleBySerializedClaimOffer,
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
  claimOfferPayload,
  poolConfig,
  serializedClaimOffers,
  serializedClaimOffer,
  vcxSerializedConnection,
} from '../../../__mocks__/static-data'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { setItem, deleteItem, getItem } from '../../services/secure-storage'

describe('claim offer store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  let initialState = {
    vcxSerializedClaimOffers: {},
  }
  let newState = {
    vcxSerializedClaimOffers: {},
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
    newState = claimOfferStore(
      newState,
      sendClaimRequest(uid, claimOfferPayload)
    )
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

  it('action: ADD_SERIALIZED_CLAIM_OFFER', () => {
    newState = claimOfferStore(
      newState,
      addSerializedClaimOffer(
        serializedClaimOffer,
        pairwiseConnection.identifier,
        uid
      )
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
    expect(gen.next(userPairwiseDid).value).toEqual(
      put(sendClaimRequest(uid, claimOfferPayload))
    )
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

  it('should reset claim offer store, if RESET action is raised', () => {
    expect(claimOfferStore(newState, { type: 'RESET' })).toMatchSnapshot()
  })

  it('action: HYDRATE_SERIALIZED_CLAIM_OFFERS_SUCCESS', () => {
    newState = claimOfferStore(
      newState,
      hydrateSerializedClaimOffers(JSON.parse(serializedClaimOffers))
    )
    expect(newState).toMatchSnapshot()
  })

  it('saga: saveSerializedClaimOfferSaga, success', () => {
    return expectSaga(
      saveSerializedClaimOffersSaga,
      addSerializedClaimOffer(
        serializedClaimOffer,
        pairwiseConnection.identifier,
        uid
      )
    )
      .withState({ claimOffer: { vcxSerializedClaimOffers: {} } })
      .call(setItem, KEY_SERIALIZED_CLAIM_OFFERS, '{}')
      .put({ type: SAVE_SERIALIZED_CLAIM_OFFERS_SUCCESS })
      .run()
  })

  it('saga: saveSerializedClaimOfferSaga, fail', () => {
    const errorMessage = 'test error'
    const failSaveSerializedClaimOffers = new Error(errorMessage)

    return expectSaga(
      saveSerializedClaimOffersSaga,
      addSerializedClaimOffer(
        serializedClaimOffer,
        pairwiseConnection.identifier,
        uid
      )
    )
      .withState({ claimOffer: { vcxSerializedClaimOffers: {} } })
      .provide([
        [
          matchers.call.fn(setItem, KEY_SERIALIZED_CLAIM_OFFERS, '{}'),
          throwError(failSaveSerializedClaimOffers),
        ],
      ])
      .put({
        type: SAVE_SERIALIZED_CLAIM_OFFERS_FAIL,
        error: ERROR_SAVE_SERIALIZED_CLAIM_OFFERS(errorMessage),
      })
      .run()
  })

  it('saga: removePersistedSerializedClaimOffersSaga, success', () => {
    return expectSaga(removePersistedSerializedClaimOffersSaga)
      .call(deleteItem, KEY_SERIALIZED_CLAIM_OFFERS)
      .put({
        type: REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS,
      })
      .run()
  })

  it('saga: hydrateSerializedClaimOffersSaga, success', () => {
    return expectSaga(hydrateSerializedClaimOffersSaga)
      .provide([
        [
          matchers.call.fn(getItem, KEY_SERIALIZED_CLAIM_OFFERS),
          serializedClaimOffers,
        ],
      ])
      .put(hydrateSerializedClaimOffers(JSON.parse(serializedClaimOffers)))
      .run()
  })

  it('saga: claimOfferAcceptedVcx, success', () => {
    const claimOfferPayload = {
      ...claimOffer.payload,
      ...claimOffer.payloadInfo,
    }
    const userDID = pairwiseConnection.identifier
    const stateWithClaimOfferAndSerialized = {
      claimOffer: {
        [uid]: claimOfferPayload,
        vcxSerializedClaimOffers: {
          [userDID]: {
            [uid]: serializedClaimOffer,
          },
        },
      },
      connections: {
        data: {
          [userDID]: {
            ...pairwiseConnection,
            senderDID: claimOfferPayload.remotePairwiseDID,
            vcxSerializedConnection: vcxSerializedConnection,
          },
        },
      },
    }
    const claimHandle = 1
    const connectionHandle = 1
    const paymentHandle = 1

    return expectSaga(claimOfferAcceptedVcx, acceptClaimOffer(uid))
      .withState(stateWithClaimOfferAndSerialized)
      .provide([
        [
          matchers.call.fn(
            getHandleBySerializedConnection,
            vcxSerializedConnection
          ),
          connectionHandle,
        ],
        [
          matchers.call.fn(
            getClaimHandleBySerializedClaimOffer,
            serializedClaimOffer
          ),
          claimHandle,
        ],
      ])
      .dispatch({ type: CLAIM_STORAGE_SUCCESS, messageId: uid })
      .call(sendClaimRequest, claimHandle, connectionHandle, paymentHandle)
      .fork(
        saveSerializedClaimOffer,
        claimHandle,
        pairwiseConnection.identifier,
        uid
      )
      .put(sendClaimRequest(uid, claimOfferPayload))
      .put(claimRequestSuccess(uid))
      .run()
  })

  it('saga: saveSerializedClaimOffer', () => {
    const claimHandle = 1
    return expectSaga(
      saveSerializedClaimOffer,
      claimHandle,
      pairwiseConnection.identifier,
      uid
    )
      .provide([
        [
          matchers.call.fn(serializeClaimOffer, claimHandle),
          serializedClaimOffer,
        ],
      ])
      .put(
        addSerializedClaimOffer(
          serializedClaimOffer,
          pairwiseConnection.identifier,
          uid
        )
      )
      .run()
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

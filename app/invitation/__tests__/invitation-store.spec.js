// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { put, call, select } from 'redux-saga/effects'
import invitationReducer, {
  invitationReceived,
  sendInvitationResponse,
  invitationSuccess,
  invitationRejected,
  invitationFail,
  sendResponse,
} from '../invitation-store'
import { initialTestAction } from '../../common/type-common'
import type { InvitationStore } from '../type-invitation'
import { ResponseType } from '../../components/request/type-request'
import {
  getAgencyUrl,
  getPushToken,
  getInvitationPayload,
  isDuplicateConnection,
} from '../../store/store-selector'
import { saveNewConnection } from '../../store/connections-store'
import { encrypt, addConnection } from '../../bridge/react-native-cxs/RNCxs'
import {
  connectWithConsumerAgency,
  registerWithConsumerAgency,
  createAgentWithConsumerAgency,
  sendInvitationResponse as sendInvitationResponseApi,
  createAgentPairwiseKey,
} from '../../api/api'
import {
  API_TYPE,
  ERROR_ALREADY_EXIST,
  ERROR_INVITATION_RESPONSE_PARSE_CODE,
  ERROR_INVITATION_RESPONSE_PARSE,
} from '../../api/api-constants'

describe('Invitation Store', () => {
  let initialState
  let afterOneInvitationState
  let propsGenerator
  let firstInvitation
  const agencyDid = '5qiK8KZQ86XjcnLmy5S2Tn'
  const agencyVerificationKey = '3dzsPMyBeJiGtsxWoyrfXZL6mqj3iXxdJ75vewJ1jSwn'

  function* getInvitation() {
    yield {
      payload: {
        senderEndpoint: 'endpoint',
        requestId: 'requestId1',
        senderAgentKeyDelegationProof: 'proof',
        senderName: 'sender1',
        senderDID: 'senderDID1',
        senderLogoUrl: 'lu',
        senderVerificationKey: 'sVk',
        targetName: 'target name',
      },
    }

    yield {
      payload: {
        senderEndpoint: 'endpoint',
        requestId: 'requestId2',
        senderAgentKeyDelegationProof: 'proof',
        senderName: 'sender2',
        senderDID: 'senderDID2',
        senderLogoUrl: 'lu',
        senderVerificationKey: 'sVk 2',
        targetName: 'target name',
      },
    }
  }

  function fail() {
    // we can use this function if we specifically want to fail a test
    expect(1).toBe(2)
  }

  beforeEach(() => {
    initialState = invitationReducer(undefined, initialTestAction())
    propsGenerator = getInvitation()
    firstInvitation = propsGenerator.next().value
    if (firstInvitation) {
      afterOneInvitationState = invitationReducer(
        initialState,
        invitationReceived(firstInvitation)
      )
    } else {
      fail()
    }
  })

  it('one invitation is received', () => {
    expect(afterOneInvitationState).toMatchSnapshot()
  })

  it('multiple invitations are received', () => {
    const nextInvitation = propsGenerator.next().value
    if (nextInvitation) {
      const nextState = invitationReducer(
        afterOneInvitationState,
        invitationReceived(nextInvitation)
      )
      expect(nextState).toMatchSnapshot()
    } else {
      fail()
    }
  })

  it('invitation response is sent', () => {
    if (firstInvitation) {
      const data = {
        senderDID: firstInvitation.payload.senderDID,
        response: ResponseType.accepted,
      }
      const state = invitationReducer(
        afterOneInvitationState,
        sendInvitationResponse(data)
      )
      expect(state).toMatchSnapshot()
    }
  })

  it('invitation response is sent successfully', () => {
    if (firstInvitation) {
      const state = invitationReducer(
        afterOneInvitationState,
        invitationSuccess(firstInvitation.payload.senderDID)
      )
      expect(state).toMatchSnapshot()
    }
  })

  it('invitation response sending failed', () => {
    if (firstInvitation) {
      const error = {
        code: 'TEST-INVITATION-FAIL',
        message: 'Invitation sending failed from test',
      }
      const state = invitationReducer(
        afterOneInvitationState,
        invitationFail(error, firstInvitation.payload.senderDID)
      )
      expect(state).toMatchSnapshot()
    }
  })

  it('invitation is rejected', () => {
    if (firstInvitation) {
      const state = invitationReducer(
        afterOneInvitationState,
        invitationRejected(firstInvitation.payload.senderDID)
      )
      expect(state).toMatchSnapshot()
    }
  })

  it('should work fine for accept invitation workflow success', () => {
    if (firstInvitation) {
      const { payload } = firstInvitation
      const senderDID = firstInvitation.payload.senderDID
      const data = {
        senderDID,
        response: ResponseType.accepted,
      }
      const gen = sendResponse(sendInvitationResponse(data))
      const agencyUrl = 'https://test-agency.com'
      const pushToken = 'jadkfjhaofuoet93tnklvansdvlq92'
      const alreadyExist = false
      expect(gen.next().value).toEqual(select(getAgencyUrl))
      expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
      expect(gen.next(pushToken).value).toEqual(
        select(getInvitationPayload, senderDID)
      )
      expect(gen.next(payload).value).toEqual(
        select(isDuplicateConnection, senderDID)
      )

      const metadata = {
        ...payload,
      }
      expect(gen.next(alreadyExist).value).toEqual(
        call(addConnection, agencyDid, agencyVerificationKey, metadata)
      )

      const identifier = '3akhf906816kahfadhfas85'
      const verificationKey = '3akhf906816kahfadhfas853akhf906816kahfadhfas85'

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        call(connectWithConsumerAgency, {
          agencyUrl,
          dataBody: {
            type: API_TYPE.CONNECT,
            fromDID: identifier,
            fromDIDVerKey: verificationKey,
          },
        })
      )

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        call(registerWithConsumerAgency, {
          agencyUrl,
          dataBody: {
            type: API_TYPE.REGISTER,
            fromDID: identifier,
          },
        })
      )

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        call(createAgentWithConsumerAgency, {
          agencyUrl,
          dataBody: {
            type: API_TYPE.CREATE_AGENT,
            forDID: identifier,
          },
        })
      )

      expect(gen.next().value).toEqual(
        call(addConnection, senderDID, payload.senderVerificationKey, metadata)
      )
      const pairwiseConnection = {
        identifier: 'pairwiseIdentifier1',
        verificationKey: 'pairwiseVerificationKey1',
      }

      expect(gen.next(pairwiseConnection).value).toEqual(
        call(createAgentPairwiseKey, {
          agencyUrl,
          dataBody: {
            to: identifier,
            agentPayload: JSON.stringify({
              type: API_TYPE.CREATE_KEY,
              forDID: pairwiseConnection.identifier,
              forDIDVerKey: pairwiseConnection.verificationKey,
              nonce: '12121212',
            }),
          },
        })
      )

      const dataBody = {
        to: pairwiseConnection.identifier,
        agentPayload: JSON.stringify({
          type: API_TYPE.INVITE_ANSWERED,
          uid: payload.requestId,
          keyDlgProof: 'delegate to agent',
          senderName: payload.senderName,
          senderLogoUrl: payload.senderLogoUrl,
          senderDID,
          senderDIDVerKey: payload.senderVerificationKey,
          remoteAgentKeyDlgProof: payload.senderAgentKeyDelegationProof,
          remoteEndpoint: payload.senderEndpoint,
          pushComMethod: `FCM:${pushToken}`,
        }),
      }

      expect(gen.next().value).toEqual(
        call(sendInvitationResponseApi, {
          agencyUrl,
          dataBody,
        })
      )

      // check if success was called after the Api call returns successfully
      expect(gen.next().value).toEqual(put(invitationSuccess(senderDID)))

      expect(gen.next().value).toEqual(
        put(
          saveNewConnection({
            newConnection: {
              identifier: pairwiseConnection.identifier,
              logoUrl: payload.senderLogoUrl,
              ...payload,
            },
          })
        )
      )

      expect(gen.next().done).toBe(true)
    }
  })

  it('should behave accordingly if accept invitation workflow fails', () => {
    if (firstInvitation) {
      const { payload } = firstInvitation
      const senderDID = firstInvitation.payload.senderDID
      const data = {
        senderDID,
        response: ResponseType.accepted,
      }
      const gen = sendResponse(sendInvitationResponse(data))
      const agencyUrl = 'https://test-agency.com'
      const pushToken = 'jadkfjhaofuoet93tnklvansdvlq92'
      const alreadyExist = false
      expect(gen.next().value).toEqual(select(getAgencyUrl))
      expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
      expect(gen.next(pushToken).value).toEqual(
        select(getInvitationPayload, senderDID)
      )
      expect(gen.next(payload).value).toEqual(
        select(isDuplicateConnection, senderDID)
      )

      const metadata = {
        ...payload,
      }
      expect(gen.next(alreadyExist).value).toEqual(
        call(addConnection, agencyDid, agencyVerificationKey, metadata)
      )

      const identifier = '3akhf906816kahfadhfas85'
      const verificationKey = '3akhf906816kahfadhfas853akhf906816kahfadhfas85'

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        call(connectWithConsumerAgency, {
          agencyUrl,
          dataBody: {
            type: API_TYPE.CONNECT,
            fromDID: identifier,
            fromDIDVerKey: verificationKey,
          },
        })
      )

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        call(registerWithConsumerAgency, {
          agencyUrl,
          dataBody: {
            type: API_TYPE.REGISTER,
            fromDID: identifier,
          },
        })
      )

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        call(createAgentWithConsumerAgency, {
          agencyUrl,
          dataBody: {
            type: API_TYPE.CREATE_AGENT,
            forDID: identifier,
          },
        })
      )

      expect(gen.next().value).toEqual(
        call(addConnection, senderDID, payload.senderVerificationKey, metadata)
      )
      const pairwiseConnection = {
        identifier: 'pairwiseIdentifier1',
        verificationKey: 'pairwiseVerificationKey1',
      }

      expect(gen.next(pairwiseConnection).value).toEqual(
        call(createAgentPairwiseKey, {
          agencyUrl,
          dataBody: {
            to: identifier,
            agentPayload: JSON.stringify({
              type: API_TYPE.CREATE_KEY,
              forDID: pairwiseConnection.identifier,
              forDIDVerKey: pairwiseConnection.verificationKey,
              nonce: '12121212',
            }),
          },
        })
      )

      const dataBody = {
        to: pairwiseConnection.identifier,
        agentPayload: JSON.stringify({
          type: API_TYPE.INVITE_ANSWERED,
          uid: payload.requestId,
          keyDlgProof: 'delegate to agent',
          senderName: payload.senderName,
          senderLogoUrl: payload.senderLogoUrl,
          senderDID,
          senderDIDVerKey: payload.senderVerificationKey,
          remoteAgentKeyDlgProof: payload.senderAgentKeyDelegationProof,
          remoteEndpoint: payload.senderEndpoint,
          pushComMethod: `FCM:${pushToken}`,
        }),
      }

      expect(gen.next().value).toEqual(
        call(sendInvitationResponseApi, {
          agencyUrl,
          dataBody,
        })
      )

      const error = { code: '123', message: 'API error' }
      // simulate error throw from api response
      expect(gen.throw(new Error(JSON.stringify(error))).value).toEqual(
        put(invitationFail(error, senderDID))
      )

      expect(gen.next().done).toBe(true)
    }
  })
})

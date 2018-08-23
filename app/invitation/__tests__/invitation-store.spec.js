// @flow
import React from 'react'
import renderer from 'react-test-renderer'
import { put, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
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
import { saveNewConnection } from '../../store/connections-store'
import {
  createConnectionWithInvite,
  acceptInvitationVcx,
  serializeConnection,
} from '../../bridge/react-native-cxs/RNCxs'
import {
  ERROR_ALREADY_EXIST,
  ERROR_INVITATION_RESPONSE_PARSE_CODE,
  ERROR_INVITATION_RESPONSE_PARSE,
} from '../../api/api-constants'
import {
  getTestInvitationPayload,
  successConnectionData,
  pairwiseConnection,
  myPairWiseConnectionDetails,
  vcxSerializedConnection,
} from '../../../__mocks__/static-data'
import { connectRegisterCreateAgentDone } from '../../store/user/user-store'
import { VCX_INIT_SUCCESS } from '../../store/type-config-store'
import { safeGet, safeSet } from '../../services/storage'

// TODO:KS These should be moved to a separate file that handles
// all of the static data of whole app, so that if we change
// one type of data, we will immediately know which other part of app it breaks
const agencyDid = '5qiK8KZQ86XjcnLmy5S2Tn'
const agencyVerificationKey = '3dzsPMyBeJiGtsxWoyrfXZL6mqj3iXxdJ75vewJ1jSwn'
const poolConfig = 'sandboxPool'
const agencyUrl = 'https://test-agency.com'
const pushToken = 'jadkfjhaofuoet93tnklvansdvlq92'
const identifier = '3akhf906816kahfadhfas85'
const verificationKey = '3akhf906816kahfadhfas853akhf906816kahfadhfas85'

describe('Invitation Store', () => {
  let initialState
  let afterOneInvitationState
  let propsGenerator
  let firstInvitation

  function fail() {
    // we can use this function if we specifically want to fail a test
    expect(1).toBe(2)
  }

  beforeEach(() => {
    initialState = invitationReducer(undefined, initialTestAction())
    propsGenerator = getTestInvitationPayload()
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

  it('should reset invitation store, if RESET action is raised', () => {
    expect(
      invitationReducer(afterOneInvitationState, { type: 'RESET' })
    ).toMatchSnapshot()
  })

  it('saga:sendResponseVcx', () => {
    if (firstInvitation) {
      const { payload } = firstInvitation
      const { senderDID, senderVerificationKey } = payload
      const data = {
        senderDID,
        response: ResponseType.accepted,
      }
      const vcxInitSuccessWithInvitationState = {
        config: {
          vcxInitializationState: VCX_INIT_SUCCESS,
        },
        invitation: {
          [senderDID]: {
            payload,
          },
        },
        connections: {},
      }
      const connectionHandle = 1

      return expectSaga(sendResponse, sendInvitationResponse(data))
        .withState(vcxInitSuccessWithInvitationState)
        .provide([
          [
            matchers.call.fn(createConnectionWithInvite, payload),
            connectionHandle,
          ],
          [
            matchers.call.fn(acceptInvitationVcx, connectionHandle),
            myPairWiseConnectionDetails,
          ],
          [
            matchers.call.fn(serializeConnection, connectionHandle),
            vcxSerializedConnection,
          ],
        ])
        .put(invitationSuccess(senderDID))
        .put(
          saveNewConnection({
            newConnection: {
              ...successConnectionData.newConnection,
              vcxSerializedConnection,
            },
          })
        )
        .run()
    }
  })
})

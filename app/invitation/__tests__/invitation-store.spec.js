// @flow
import React from 'react'
import { AsyncStorage } from 'react-native'
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
  sendResponseVcx,
} from '../invitation-store'
import { initialTestAction } from '../../common/type-common'
import type { InvitationStore } from '../type-invitation'
import { ResponseType } from '../../components/request/type-request'
import {
  getAgencyUrl,
  getPushToken,
  getAgencyDID,
  getAgencyVerificationKey,
  getInvitationPayload,
  isDuplicateConnection,
  getUserOneTimeInfo,
  getPoolConfig,
  getUseVcx,
} from '../../store/store-selector'
import { saveNewConnection } from '../../store/connections-store'
import {
  addConnection,
  connectToAgency,
  registerWithAgency,
  createOneTimeAgent,
  createPairwiseAgent,
  acceptInvitation,
  updatePushToken,
  createConnectionWithInvite,
  acceptInvitationVcx,
  serializeConnection,
} from '../../bridge/react-native-cxs/RNCxs'
import {
  ERROR_ALREADY_EXIST,
  ERROR_INVITATION_RESPONSE_PARSE_CODE,
  ERROR_INVITATION_RESPONSE_PARSE,
} from '../../api/api-constants'
import { IS_CONSUMER_AGENT_ALREADY_CREATED } from '../../common'
import {
  getTestInvitationPayload,
  successConnectionData,
  pairwiseConnection,
  myPairWiseConnectionDetails,
  vcxSerializedConnection,
} from '../../../__mocks__/static-data'
import { connectRegisterCreateAgentDone } from '../../store/user/user-store'
import { VCX_INIT_SUCCESS } from '../../store/type-config-store'

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

  it('should work fine for accept invitation workflow success', () => {
    if (firstInvitation) {
      const { payload } = firstInvitation
      const { senderDID, senderVerificationKey } = payload
      const useVcx = true
      const data = {
        senderDID,
        response: ResponseType.accepted,
      }
      const gen = sendResponse(sendInvitationResponse(data))
      const alreadyExist = false
      expect(gen.next().value).toEqual(select(getUseVcx))
      expect(gen.next().value).toEqual(select(getAgencyUrl))
      expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
      expect(gen.next(pushToken).value).toEqual(select(getAgencyDID))
      expect(gen.next(agencyDid).value).toEqual(
        select(getAgencyVerificationKey)
      )

      expect(gen.next(agencyVerificationKey).value).toEqual(
        select(getInvitationPayload, senderDID)
      )
      expect(gen.next(payload).value).toEqual(select(getPoolConfig))
      const metadata = {
        ...payload,
      }
      expect(gen.next(poolConfig).value).toEqual(
        call(
          addConnection,
          agencyDid,
          agencyVerificationKey,
          metadata,
          poolConfig
        )
      )

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        select(isDuplicateConnection, senderDID)
      )
      expect(gen.next().value).toEqual(
        call(AsyncStorage.getItem, IS_CONSUMER_AGENT_ALREADY_CREATED)
      )
      expect(gen.next(senderDID).value).toEqual(select(getAgencyUrl))
      expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
      expect(gen.next().value).toEqual(select(getAgencyDID))
      expect(gen.next(agencyDid).value).toEqual(
        select(getAgencyVerificationKey)
      )
      expect(gen.next(agencyVerificationKey).value).toEqual(
        select(getPoolConfig)
      )

      const url = `${agencyUrl}/agency/msg`
      expect(gen.next(poolConfig).value).toEqual(
        call(connectToAgency, {
          url,
          myDid: identifier,
          agencyDid,
          myVerKey: verificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      const connectResponse = {
        withPairwiseDID: 'oneTimeAgencyDid',
        withPairwiseDIDVerKey: 'oneTimeAgencyVerKey',
      }
      const oneTimeAgencyDid = connectResponse.withPairwiseDID
      const oneTimeAgencyVerificationKey = connectResponse.withPairwiseDIDVerKey
      const myOneTimeDid = identifier
      const myOneTimeVerificationKey = verificationKey
      expect(gen.next(connectResponse).value).toEqual(
        call(registerWithAgency, {
          url,
          oneTimeAgencyVerKey: oneTimeAgencyVerificationKey,
          oneTimeAgencyDid: oneTimeAgencyDid,
          myOneTimeVerKey: myOneTimeVerificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      expect(gen.next().value).toEqual(
        call(createOneTimeAgent, {
          url,
          oneTimeAgencyVerKey: oneTimeAgencyVerificationKey,
          oneTimeAgencyDid: oneTimeAgencyDid,
          myOneTimeVerKey: myOneTimeVerificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      const createAgentResponse = {
        withPairwiseDID: 'oneTimeAgentDid',
        withPairwiseDIDVerKey: 'oneTimeAgentVerKey',
      }
      const myOneTimeAgentDid = createAgentResponse.withPairwiseDID
      const myOneTimeAgentVerificationKey =
        createAgentResponse.withPairwiseDIDVerKey
      const userOneTimeInfo = {
        oneTimeAgencyDid,
        oneTimeAgencyVerificationKey,
        myOneTimeDid,
        myOneTimeVerificationKey,
        myOneTimeAgentDid,
        myOneTimeAgentVerificationKey,
      }
      expect(gen.next(createAgentResponse).value).toEqual(
        put(connectRegisterCreateAgentDone(userOneTimeInfo))
      )

      expect(gen.next().value).toEqual(
        call(AsyncStorage.setItem, IS_CONSUMER_AGENT_ALREADY_CREATED, 'true')
      )

      expect(gen.next(senderDID).value).toEqual(
        call(
          addConnection,
          senderDID,
          payload.senderVerificationKey,
          metadata,
          poolConfig
        )
      )

      expect(gen.next(pairwiseConnection).value).toEqual(
        select(getUserOneTimeInfo)
      )

      expect(gen.next(userOneTimeInfo).value).toEqual(
        call(createPairwiseAgent, {
          url,
          myPairwiseDid: pairwiseConnection.identifier,
          myPairwiseVerKey: pairwiseConnection.verificationKey,
          oneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
          oneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
          myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      const pairwiseAgentResponse = {
        withPairwiseDID: 'myPairwiseAgentDID',
        withPairwiseDIDVerKey: 'myPairwiseAgentVerKey',
      }
      expect(gen.next(pairwiseAgentResponse).value).toEqual(
        call(acceptInvitation, {
          url,
          requestId: payload.requestId,
          myPairwiseDid: pairwiseConnection.identifier,
          myPairwiseVerKey: pairwiseConnection.verificationKey,
          invitation: payload,
          myPairwiseAgentDid: pairwiseAgentResponse.withPairwiseDID,
          myPairwiseAgentVerKey: pairwiseAgentResponse.withPairwiseDIDVerKey,
          myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
          myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
          myOneTimeDid: userOneTimeInfo.myOneTimeDid,
          myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
          myAgencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      // check if success was called after the Api call returns successfully
      expect(gen.next().value).toEqual(put(invitationSuccess(senderDID)))

      expect(gen.next().value).toEqual(
        put(saveNewConnection(successConnectionData))
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
      const useVcx = true
      const agencyUrl = 'https://test-agency.com'
      const pushToken = 'jadkfjhaofuoet93tnklvansdvlq92'
      const alreadyExist = false
      expect(gen.next().value).toEqual(select(getUseVcx))
      expect(gen.next().value).toEqual(select(getAgencyUrl))
      expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
      expect(gen.next(pushToken).value).toEqual(select(getAgencyDID))
      expect(gen.next(agencyDid).value).toEqual(
        select(getAgencyVerificationKey)
      )
      expect(gen.next(agencyVerificationKey).value).toEqual(
        select(getInvitationPayload, senderDID)
      )
      expect(gen.next(payload).value).toEqual(select(getPoolConfig))
      const metadata = {
        ...payload,
      }
      expect(gen.next(poolConfig).value).toEqual(
        call(
          addConnection,
          agencyDid,
          agencyVerificationKey,
          metadata,
          poolConfig
        )
      )
      const identifier = '3akhf906816kahfadhfas85'
      const verificationKey = '3akhf906816kahfadhfas853akhf906816kahfadhfas85'

      expect(gen.next({ identifier, verificationKey }).value).toEqual(
        select(isDuplicateConnection, senderDID)
      )
      expect(gen.next().value).toEqual(
        call(AsyncStorage.getItem, IS_CONSUMER_AGENT_ALREADY_CREATED)
      )

      expect(gen.next(senderDID).value).toEqual(select(getAgencyUrl))
      expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
      expect(gen.next().value).toEqual(select(getAgencyDID))
      expect(gen.next(agencyDid).value).toEqual(
        select(getAgencyVerificationKey)
      )
      expect(gen.next(agencyVerificationKey).value).toEqual(
        select(getPoolConfig)
      )

      const url = `${agencyUrl}/agency/msg`
      expect(gen.next(poolConfig).value).toEqual(
        call(connectToAgency, {
          url,
          myDid: identifier,
          agencyDid,
          myVerKey: verificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      const connectResponse = {
        withPairwiseDID: 'oneTimeAgencyDid',
        withPairwiseDIDVerKey: 'oneTimeAgencyVerKey',
      }
      const oneTimeAgencyDid = connectResponse.withPairwiseDID
      const oneTimeAgencyVerificationKey = connectResponse.withPairwiseDIDVerKey
      const myOneTimeDid = identifier
      const myOneTimeVerificationKey = verificationKey
      expect(gen.next(connectResponse).value).toEqual(
        call(registerWithAgency, {
          url,
          oneTimeAgencyVerKey: oneTimeAgencyVerificationKey,
          oneTimeAgencyDid: oneTimeAgencyDid,
          myOneTimeVerKey: myOneTimeVerificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      expect(gen.next().value).toEqual(
        call(createOneTimeAgent, {
          url,
          oneTimeAgencyVerKey: oneTimeAgencyVerificationKey,
          oneTimeAgencyDid: oneTimeAgencyDid,
          myOneTimeVerKey: myOneTimeVerificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      const createAgentResponse = {
        withPairwiseDID: 'oneTimeAgentDid',
        withPairwiseDIDVerKey: 'oneTimeAgentVerKey',
      }
      const myOneTimeAgentDid = createAgentResponse.withPairwiseDID
      const myOneTimeAgentVerificationKey =
        createAgentResponse.withPairwiseDIDVerKey

      const userOneTimeInfo = {
        oneTimeAgencyDid,
        oneTimeAgencyVerificationKey,
        myOneTimeDid,
        myOneTimeVerificationKey,
        myOneTimeAgentDid,
        myOneTimeAgentVerificationKey,
      }
      expect(gen.next(createAgentResponse).value).toEqual(
        put(connectRegisterCreateAgentDone(userOneTimeInfo))
      )

      expect(gen.next().value).toEqual(
        call(AsyncStorage.setItem, IS_CONSUMER_AGENT_ALREADY_CREATED, 'true')
      )

      expect(gen.next().value).toEqual(
        call(
          addConnection,
          senderDID,
          payload.senderVerificationKey,
          metadata,
          poolConfig
        )
      )
      const pairwiseConnection = {
        identifier: 'pairwiseIdentifier1',
        verificationKey: 'pairwiseVerificationKey1',
      }
      expect(gen.next(pairwiseConnection).value).toEqual(
        select(getUserOneTimeInfo)
      )

      expect(gen.next(userOneTimeInfo).value).toEqual(
        call(createPairwiseAgent, {
          url,
          myPairwiseDid: pairwiseConnection.identifier,
          myPairwiseVerKey: pairwiseConnection.verificationKey,
          oneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
          oneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
          myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
          agencyVerKey: agencyVerificationKey,
          poolConfig,
        })
      )

      const pairwiseAgentResponse = {
        withPairwiseDID: 'myPairwiseAgentDID',
        withPairwiseDIDVerKey: 'myPairwiseAgentVerKey',
      }
      expect(gen.next(pairwiseAgentResponse).value).toEqual(
        call(acceptInvitation, {
          url,
          requestId: payload.requestId,
          myPairwiseDid: pairwiseConnection.identifier,
          myPairwiseVerKey: pairwiseConnection.verificationKey,
          invitation: payload,
          myPairwiseAgentDid: pairwiseAgentResponse.withPairwiseDID,
          myPairwiseAgentVerKey: pairwiseAgentResponse.withPairwiseDIDVerKey,
          myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
          myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
          myOneTimeDid: userOneTimeInfo.myOneTimeDid,
          myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
          myAgencyVerKey: agencyVerificationKey,
          poolConfig,
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

      return expectSaga(sendResponseVcx, sendInvitationResponse(data))
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

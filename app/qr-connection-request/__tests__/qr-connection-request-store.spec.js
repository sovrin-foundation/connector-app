// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { call, select, put } from 'redux-saga/effects'
import {
  getAgencyUrl,
  getPushToken,
  getQrPayload,
  getAllConnection,
} from '../../store/store-selector'
import { ResponseType } from '../../components/request/type-request'
import qrConnectionRequestReducer, {
  qrConnectionRequestReceived,
  qrConnectionSuccess,
  qrConnectionFail,
  sendQrConnectionResponse,
  sendQrResponse,
} from '../qr-connection-request-store'
import {
  sendInvitationResponse,
  connectWithConsumerAgency,
  registerWithConsumerAgency,
  createAgentWithConsumerAgency,
} from '../../services'
import { API_TYPE } from '../../services/api'
import { addConnection, encrypt } from '../../bridge/react-native-cxs/RNCxs'
import { saveNewConnection } from '../../store/connections-store'

describe('Qr Connection Request store', () => {
  const expectedInitialState = {
    title: '',
    message: '',
    senderLogoUrl: null,
    payload: null,
    status: ResponseType.none,
    isFetching: false,
    error: null,
  }

  const payload = {
    lu: 'https://logourl.com/logo.png',
    rid: 'requestUniqueId',
    sakdp: 'senderAgentkeyDelegationProof',
    sn: 'sender name',
    tn: 'target name',
    sD: 'senderDID',
    sVk: 'senderVerificationKey',
    e: 'https://remoteagentendpoint.com/agent',
  }

  const title = 'Hi Test'
  const message = 'En wants to connect with you'

  it('should be correct initial state', () => {
    const actualInitialState = qrConnectionRequestReducer(undefined, {
      type: 'INITIAL_TEST_ACTION',
    })
    expect(actualInitialState).toEqual(expectedInitialState)
  })

  it('qr connection received updates store correctly', () => {
    const qrReceivedAction = qrConnectionRequestReceived({
      payload,
      title,
      message,
    })
    const stateAfterQrReceived = qrConnectionRequestReducer(
      expectedInitialState,
      qrReceivedAction
    )
    expect(stateAfterQrReceived).toEqual({
      ...expectedInitialState,
      payload,
      title,
      message,
    })
  })

  it('flow for sending response and receiving success should work', () => {
    const gen = sendQrResponse(
      sendQrConnectionResponse({ response: ResponseType.accepted })
    )
    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'https://test-agency.com'
    const pushToken = 'jadkfjhaofuoet93tnklvansdvlq92'

    expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
    expect(gen.next(pushToken).value).toEqual(select(getQrPayload))
    expect(gen.next(payload).value).toEqual(select(getAllConnection))

    const senderDID = payload.sD
    const metadata = {
      senderDID,
    }
    expect(gen.next({}).value).toEqual(call(addConnection, senderDID, metadata))

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

    const dataBody = {
      to: identifier,
      agentPayload: JSON.stringify({
        type: API_TYPE.INVITE_ANSWERED,
        uid: payload.rid,
        keyDlgProof: 'delegate to agent',
        senderName: payload.sn,
        senderLogoUrl: payload.lu,
        senderDID,
        senderDIDVerKey: payload.sVk,
        remoteAgentKeyDlgProof: payload.sakdp,
        remoteEndpoint: payload.e,
        pushComMethod: `FCM:${pushToken}`,
      }),
    }

    expect(gen.next().value).toEqual(
      call(sendInvitationResponse, {
        agencyUrl,
        dataBody,
      })
    )

    // check if success was called after the Api call returns successfully
    expect(gen.next().value).toEqual(put(qrConnectionSuccess()))

    expect(gen.next().value).toEqual(
      put(
        saveNewConnection({
          newConnection: {
            identifier,
            senderDID,
            logoUrl: payload.lu,
            senderEndpoint: payload.e,
          },
        })
      )
    )

    expect(gen.next().done).toBe(true)
  })

  it('flow for sending response and receiving failure should work', () => {
    const gen = sendQrResponse(
      sendQrConnectionResponse({ response: ResponseType.accepted })
    )
    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'https://test-agency.com'
    const pushToken = 'jadkfjhaofuoet93tnklvansdvlq92'

    expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
    expect(gen.next(pushToken).value).toEqual(select(getQrPayload))
    expect(gen.next(payload).value).toEqual(select(getAllConnection))

    const senderDID = payload.sD
    const metadata = {
      senderDID,
    }
    expect(gen.next({}).value).toEqual(call(addConnection, senderDID, metadata))

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

    const dataBody = {
      to: identifier,
      agentPayload: JSON.stringify({
        type: API_TYPE.INVITE_ANSWERED,
        uid: payload.rid,
        keyDlgProof: 'delegate to agent',
        senderName: payload.sn,
        senderLogoUrl: payload.lu,
        senderDID,
        senderDIDVerKey: payload.sVk,
        remoteAgentKeyDlgProof: payload.sakdp,
        remoteEndpoint: payload.e,
        pushComMethod: `FCM:${pushToken}`,
      }),
    }

    expect(gen.next().value).toEqual(
      call(sendInvitationResponse, {
        agencyUrl,
        dataBody,
      })
    )

    const error = { code: '123', message: 'API error' }
    // simulate error throw from api response
    expect(gen.throw(new Error(JSON.stringify(error))).value).toEqual(
      put(qrConnectionFail(error))
    )
    expect(gen.next().done).toBe(true)
  })
})

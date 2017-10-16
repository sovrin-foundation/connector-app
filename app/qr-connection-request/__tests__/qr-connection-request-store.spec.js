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
import { sendQRInvitationResponse } from '../../services'
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
    challenge: {
      tDID: 'targetDiD',
      sn: 'sender name',
      tn: 'user name',
      uid: 'requestId',
      rhDID: 'remoteDid',
      rpDID: 'remotePairwiseDid',
    },
    signature: 'sigQrData',
    qrData: { c: 'challengeQrData', s: 'sigQrData' },
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
      payload: payload,
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

    const remoteConnectionId = payload.challenge.rpDID
    expect(gen.next({}).value).toEqual(call(addConnection, remoteConnectionId))
    const identifier = '3akhf906816kahfadhfas85'
    const verificationKey = '3akhf906816kahfadhfas853akhf906816kahfadhfas85'

    const challenge = JSON.stringify({
      remoteChallenge: payload.qrData.c,
      remoteSig: payload.signature,
      newStatus: ResponseType.accepted,
      identifier,
      verKey: verificationKey,
      pushComMethod: `FCM:${pushToken}`,
    })
    const signature = 'signature'
    expect(gen.next({ identifier, verificationKey }).value).toEqual(
      call(encrypt, remoteConnectionId, challenge)
    )

    expect(gen.next(signature).value).toEqual(
      call(sendQRInvitationResponse, {
        agencyUrl,
        challenge,
        signature,
      })
    )

    // check if success was called after the Api call returns successfully
    expect(gen.next().value).toEqual(put(qrConnectionSuccess()))

    expect(gen.next().value).toEqual(
      put(
        saveNewConnection({
          newConnection: {
            identifier,
            remoteConnectionId,
            remoteDID: payload.challenge.rhDID,
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

    const remoteConnectionId = payload.challenge.rpDID
    expect(gen.next({}).value).toEqual(call(addConnection, remoteConnectionId))
    const identifier = '3akhf906816kahfadhfas85'
    const verificationKey = '3akhf906816kahfadhfas853akhf906816kahfadhfas85'

    const challenge = JSON.stringify({
      remoteChallenge: payload.qrData.c,
      remoteSig: payload.signature,
      newStatus: ResponseType.accepted,
      identifier,
      verKey: verificationKey,
      pushComMethod: `FCM:${pushToken}`,
    })
    const signature = 'signature'
    expect(gen.next({ identifier, verificationKey }).value).toEqual(
      call(encrypt, remoteConnectionId, challenge)
    )

    expect(gen.next(signature).value).toEqual(
      call(sendQRInvitationResponse, {
        agencyUrl,
        challenge,
        signature,
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

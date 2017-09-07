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
  sendQrConnectionResponse,
  sendQrResponse,
} from '../qr-connection-request-store'
import { sendQRInvitationResponse } from '../../services'

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

    expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
    expect(gen.next().value).toEqual(select(getQrPayload))
    expect(gen.next(payload).value).toEqual(select(getAllConnection))

    const challenge = 'challenge'
    const signature = 'signature'
    const expectedApiCall = call(sendQRInvitationResponse, {
      agencyUrl,
      challenge,
      signature,
    })
    const actualApiCall: any = gen.next(payload).value

    expect(actualApiCall['CALL'].args[0]).toEqual(
      expect.objectContaining({
        agencyUrl,
        challenge: expect.any(String),
        signature: expect.any(String),
      })
    )
    // check if success was called after the Api call returns successfully
    expect(gen.next().value).toEqual(put(qrConnectionSuccess()))

    const actualSaveConnection: any = gen.next().value
    expect(actualSaveConnection['PUT'].action).toEqual(
      expect.objectContaining({
        type: 'NEW_CONNECTION',
        connection: {
          newConnection: {
            identifier: expect.any(String),
            remoteConnectionId: payload.challenge.rpDID,
            seed: expect.any(String),
            remoteDID: payload.challenge.rhDID,
          },
        },
      })
    )

    expect(gen.next().done).toBe(true)
  })

  xit('flow for sending response and receiving failure should work', () => {
    // TODO: Add test for failing api call
  })
})

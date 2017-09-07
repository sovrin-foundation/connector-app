// @flow
import { call, select, put } from 'redux-saga/effects'
import {
  getAgencyUrl,
  getPushToken,
  getSMSToken,
  getSMSRemoteConnectionId,
  getAllConnection,
  getSenderGeneratedUserDidSMSRequest,
  getSMSConnectionRequestId,
  getSMSConnectionRequestRemoteDID,
} from '../../store/store-selector'
import { ResponseType } from '../../components/request/type-request'
import smsConnectionRequestReducer, {
  callPendingSMSConnectionRequest,
  getSMSConnectionRequestDetails,
  pendingSMSConnectionFail,
  smsConnectionRequestReceived,
  sendSMSResponse,
  sendSMSConnectionResponse,
  smsConnectionSuccess,
  smsConnectionFail,
} from '../sms-connection-request-store'
import { SMS_CONNECTION_REQUEST } from '../type-sms-connection-request'
import {
  invitationDetailsRequest,
  sendSMSInvitationResponse,
} from '../../services'
import { PENDING_CONNECTION_REQUEST_CODE } from '../../common'

describe('SMS Connection Request store', () => {
  const initialState = {
    payload: {},
    status: ResponseType.none,
    isFetching: false,
    error: null,
  }

  const payload = {
    title: 'Hi Test',
    message: 'Enterprise wants to connect with you',
    statusCode: PENDING_CONNECTION_REQUEST_CODE,
    senderLogoUrl: 'https://test-agency.com/logo',
    remotePairwiseDID: '5iZiu2aLYrQXSdon123456',
    remoteConnectionId: '5iZiu2aLYrQXSdon123456',
  }

  it('should be correct initial state', () => {
    const actualInitialState = smsConnectionRequestReducer(undefined, {
      type: 'INITIAL_TEST_ACTION',
    })
    expect(actualInitialState).toEqual(initialState)
  })

  it('sms connection request received and should update store properly', () => {
    const gen = callPendingSMSConnectionRequest(getSMSConnectionRequestDetails)

    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'https://test-agency.com'

    expect(gen.next(agencyUrl).value).toEqual(select(getSMSToken))
    const smsToken = 'fvWXvAx'

    const expectedApiCall = call(invitationDetailsRequest, {
      smsToken,
      agencyUrl,
    })

    const actualApiCall: any = gen.next(smsToken).value
    expect(actualApiCall['CALL'].args[0]).toEqual(
      expect.objectContaining({
        smsToken,
        agencyUrl,
      })
    )

    const actualRequestReceived: any = gen.next(payload).value
    const { remotePairwiseDID, ...expectedPayload } = payload
    expect(actualRequestReceived['PUT'].action).toEqual(
      expect.objectContaining({
        type: SMS_CONNECTION_REQUEST,
        data: { ...expectedPayload, payload },
      })
    )

    expect(gen.next().done).toBe(true)
  })

  it('sms connection pending request fail and should update store properly', () => {
    const error = {
      code: 'OCS',
      message: 'sms connection pending request api error',
    }
    const expectedState = {
      ...initialState,
      error,
    }
    const pendingSMSConnectionFailAction = pendingSMSConnectionFail(error)
    const actualState = smsConnectionRequestReducer(
      initialState,
      pendingSMSConnectionFailAction
    )
    expect(actualState).toEqual(expectedState)
  })

  it('sms flow for sending response and receiving success should work', () => {
    const gen = sendSMSResponse(
      sendSMSConnectionResponse({ response: ResponseType.accepted })
    )
    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'https://test-agency.com'

    expect(gen.next(agencyUrl).value).toEqual(select(getPushToken))
    const pushToken = 'fvWXvAxQQL4:APA91bEKpfTu2IDhMDq6687'

    expect(gen.next(pushToken).value).toEqual(
      select(getSenderGeneratedUserDidSMSRequest)
    )
    const senderGeneratedUserDid = 'DiDA91bEKpfTu2IDhMDq6687'

    expect(gen.next(senderGeneratedUserDid).value).toEqual(
      select(getSMSConnectionRequestId)
    )
    const requestId = 'f5XKysZ'

    expect(gen.next(requestId).value).toEqual(select(getSMSRemoteConnectionId))
    const remoteConnectionId = payload.remoteConnectionId

    expect(gen.next(remoteConnectionId).value).toEqual(
      select(getSMSConnectionRequestRemoteDID)
    )
    const remoteDID = 'DidRemoteAs868sdfSKHIYUDdfs5z'

    expect(gen.next(remoteDID).value).toEqual(select(getAllConnection))

    const challenge = 'challenge'
    const signature = 'signature'
    const expectedApiCall = call(sendSMSInvitationResponse, {
      agencyUrl,
      challenge,
      signature,
      requestId,
      senderGeneratedUserDid,
    })
    const actualApiCall: any = gen.next(payload.remoteConnectionId).value

    expect(actualApiCall['CALL'].args[0]).toEqual(
      expect.objectContaining({
        agencyUrl: agencyUrl,
        challenge: expect.any(String),
        signature: expect.any(String),
        requestId,
        senderGeneratedUserDid,
      })
    )
    // check if success was called after the Api call returns successfully
    expect(gen.next().value).toEqual(put(smsConnectionSuccess()))

    const actualSaveConnection: any = gen.next().value
    expect(actualSaveConnection['PUT'].action).toEqual(
      expect.objectContaining({
        type: 'NEW_CONNECTION',
        connection: {
          newConnection: {
            identifier: expect.any(String),
            remoteConnectionId: payload.remotePairwiseDID,
            seed: expect.any(String),
            remoteDID,
          },
        },
      })
    )

    expect(gen.next().done).toBe(true)
  })

  it('sms flow for sending response and receiving failure should work', () => {
    const error = {
      code: 'OCS',
      message: 'sms connection response api error error',
    }
    const expectedState = {
      ...initialState,
      error,
    }
    const smsConnectionFailAction = smsConnectionFail(error)
    const actualState = smsConnectionRequestReducer(
      initialState,
      smsConnectionFailAction
    )
    expect(actualState).toEqual(expectedState)
  })
})

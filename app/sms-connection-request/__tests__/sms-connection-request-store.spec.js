// @flow
import { call, select, put } from 'redux-saga/effects'
import {
  getAgencyUrl,
  getPushToken,
  getSMSToken,
  getSMSRemoteConnectionId,
  getAllConnection,
  getSmsInvitationPayload,
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
  getInvitationLink,
  invitationDetailsRequest,
  connectWithConsumerAgency,
  registerWithConsumerAgency,
  createAgentWithConsumerAgency,
  sendInvitationResponse,
} from '../../services'
import { PENDING_CONNECTION_REQUEST_CODE, API_TYPE } from '../../services/api'
import { addConnection, encrypt } from '../../bridge/react-native-cxs/RNCxs'
import { saveNewConnection } from '../../store/connections-store'

describe('SMS Connection Request store', () => {
  const initialState = {
    payload: {},
    status: ResponseType.none,
    isFetching: false,
    error: null,
  }

  const payload = {
    connReqId: '123asd',
    targetName: 'Test',
    senderName: 'Evernym, Inc',
    title: 'Hi, Test',
    message: 'Evernym, Inc wants to connect with you.',
    senderLogoUrl: 'http://test-agency.com/logo',
    senderDID: '5iZiu2aLYrQXSdon123456',
    senderEndpoint: '192.168.1.1:80',
    senderDIDVerKey: '12345rD1ybsSR9hKWBePkRSZdnYHAv4KQ8XxcWHHasdf',
  }

  const identifier = 'jhad09375knkfob91rhvlsvy0q09sdnskv'
  const verificationKey = 'jhad09375knkfob91rhvlsvy0q09sdnskv'

  it('should be correct initial state', () => {
    const actualInitialState = smsConnectionRequestReducer(undefined, {
      type: 'INITIAL_TEST_ACTION',
    })
    expect(actualInitialState).toEqual(initialState)
  })

  it('sms connection request received and should update store properly', () => {
    const gen = callPendingSMSConnectionRequest(getSMSConnectionRequestDetails)

    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'http://test-agency.com'

    expect(gen.next(agencyUrl).value).toEqual(select(getSMSToken))
    const smsToken = 'fvWXvAx'

    const expectedInvitationApiCall = call(getInvitationLink, {
      agencyUrl,
      smsToken,
    })

    const actualInvitationApiCall: any = gen.next(smsToken).value
    expect(actualInvitationApiCall['CALL'].args[0]).toEqual(
      expect.objectContaining({
        agencyUrl,
        smsToken,
      })
    )
    const invitationData = { url: 'http://enterprise-agency.com' }

    const expectedApiCall = call(invitationDetailsRequest, {
      url: invitationData.url,
    })

    const actualApiCall: any = gen.next(invitationData).value
    expect(actualApiCall['CALL'].args[0]).toEqual(
      expect.objectContaining({
        url: invitationData.url,
      })
    )

    const actualRequestReceived: any = gen.next(payload).value
    const { senderDID, ...expectedPayload } = payload
    expect(actualRequestReceived['PUT'].action).toEqual(
      expect.objectContaining({
        type: SMS_CONNECTION_REQUEST,
        data: { ...expectedPayload, ...payload },
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

    expect(gen.next(pushToken).value).toEqual(select(getSmsInvitationPayload))

    expect(gen.next(payload).value).toEqual(select(getAllConnection))

    const metadata = {
      senderDID: payload.senderDID,
    }
    expect(gen.next(payload.senderDID).value).toEqual(
      call(addConnection, payload.senderDID, metadata)
    )

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

    const acceptInvitation = {
      to: identifier,
      agentPayload: JSON.stringify({
        type: API_TYPE.INVITE_ANSWERED,
        uid: payload.connReqId,
        keyDlgProof: 'delegate to agent',
        senderName: payload.senderName,
        senderLogoUrl: payload.senderLogoUrl,
        senderDID: payload.senderDID,
        senderDIDVerKey: payload.senderDIDVerKey,
        remoteAgentKeyDlgProof: 'delegated to agent',
        remoteEndpoint: payload.senderEndpoint,
        pushComMethod: `FCM:${pushToken}`,
      }),
    }

    expect(gen.next().value).toEqual(
      call(sendInvitationResponse, {
        agencyUrl,
        dataBody: acceptInvitation,
      })
    )

    // check if success was called after the Api call returns successfully
    expect(gen.next().value).toEqual(put(smsConnectionSuccess()))

    expect(gen.next().value).toEqual(
      put(
        saveNewConnection({
          newConnection: {
            identifier,
            logoUrl: payload.senderLogoUrl,
            senderDID: payload.senderDID,
            senderEndpoint: payload.senderEndpoint,
          },
        })
      )
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

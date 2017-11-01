// @flow
import { call, select, put } from 'redux-saga/effects'
import { getAgencyUrl } from '../../store/store-selector'
import smsPendingInvitationReducer, {
  callSmsPendingInvitationRequest,
  convertSmsPayloadToInvitation,
  smsPendingInvitationFail,
  smsPendingInvitationReceived,
  getSmsPendingInvitation,
  smsPendingInvitationSeen,
} from '../sms-pending-invitation-store'
import { SMSPendingInvitationStatus } from '../type-sms-pending-invitation'
import { getInvitationLink, invitationDetailsRequest } from '../../services'
import { PENDING_CONNECTION_REQUEST_CODE, API_TYPE } from '../../services/api'
import { addConnection, encrypt } from '../../bridge/react-native-cxs/RNCxs'
import { initialTestAction } from '../../common/type-common'
import { invitationReceived } from '../../invitation/invitation-store'

describe('SMS Connection Request store', () => {
  const initialState = {
    payload: null,
    status: SMSPendingInvitationStatus.NONE,
    isFetching: false,
    error: null,
  }
  const smsToken = 'gm76ku'

  const payload = {
    connReqId: '123asd',
    targetName: 'Test',
    senderName: 'Evernym, Inc',
    senderLogoUrl: 'http://test-agency.com/logo',
    senderDID: '5iZiu2aLYrQXSdon123456',
    senderEndpoint: '192.168.1.1:80',
    senderDIDVerKey: '12345rD1ybsSR9hKWBePkRSZdnYHAv4KQ8XxcWHHasdf',
    senderAgentKeyDlgProof: 'delegate proof',
    statusCode: 'MS-000',
  }

  const getPendingInvitationState = state =>
    smsPendingInvitationReducer(state, getSmsPendingInvitation(smsToken))

  it('should be correct initial state', () => {
    const actualInitialState = smsPendingInvitationReducer(
      undefined,
      initialTestAction()
    )
    expect(actualInitialState).toEqual(initialState)
  })

  it('should update store when pending invitation is requested', () => {
    const nextState = getPendingInvitationState(initialState)

    expect(nextState).toMatchSnapshot()
  })

  it('should update store when invitation received', () => {
    const invitationRequestedState = getPendingInvitationState(initialState)
    const nextState = smsPendingInvitationReducer(
      invitationRequestedState,
      smsPendingInvitationReceived(payload)
    )

    expect(nextState).toMatchSnapshot()
  })

  it('should update store when invitation receive fail', () => {
    const invitationRequestedState = getPendingInvitationState(initialState)
    const nextState = smsPendingInvitationReducer(
      invitationRequestedState,
      smsPendingInvitationFail({
        code: 'TEST-FAIL',
        message: 'Test fail message',
      })
    )

    expect(nextState).toMatchSnapshot()
  })

  it('should update store when invitation is seen', () => {
    const invitationRequestedState = getPendingInvitationState(initialState)
    const afterReceived = smsPendingInvitationReducer(
      invitationRequestedState,
      smsPendingInvitationReceived(payload)
    )
    const nextState = smsPendingInvitationReducer(
      afterReceived,
      smsPendingInvitationSeen()
    )

    expect(nextState).toMatchSnapshot()
  })

  it('sms invitation download workflow should work fine if api returns success', () => {
    const gen = callSmsPendingInvitationRequest(
      getSmsPendingInvitation(smsToken)
    )

    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'http://test-agency.com'

    expect(gen.next(agencyUrl).value).toEqual(
      call(getInvitationLink, {
        agencyUrl,
        smsToken,
      })
    )

    const invitationData = { url: 'http://enterprise-agency.com' }

    expect(gen.next(invitationData).value).toEqual(
      call(invitationDetailsRequest, {
        url: invitationData.url,
      })
    )

    expect(gen.next(payload).value).toEqual(
      put(smsPendingInvitationReceived(payload))
    )

    expect(gen.next().value).toEqual(
      put(
        invitationReceived({ payload: convertSmsPayloadToInvitation(payload) })
      )
    )

    expect(gen.next().done).toBe(true)
  })

  it('sms invitation download error should raise fail action', () => {
    const error = {
      code: 'OCS',
      message: 'sms connection pending request api error',
    }

    const gen = callSmsPendingInvitationRequest(
      getSmsPendingInvitation(smsToken)
    )

    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'http://test-agency.com'

    expect(gen.next(agencyUrl).value).toEqual(
      call(getInvitationLink, {
        agencyUrl,
        smsToken,
      })
    )

    expect(gen.throw(new Error(JSON.stringify(error))).value).toEqual(
      put(smsPendingInvitationFail(error))
    )

    expect(gen.next().done).toBe(true)
  })
})

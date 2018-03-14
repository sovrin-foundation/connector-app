// @flow
import { call, select, put, take } from 'redux-saga/effects'
import {
  getAgencyUrl,
  getCurrentScreen,
  getHydrationState,
} from '../../store/store-selector'
import smsPendingInvitationReducer, {
  callSmsPendingInvitationRequest,
  convertSmsPayloadToInvitation,
  smsPendingInvitationFail,
  smsPendingInvitationReceived,
  getSmsPendingInvitation,
  smsPendingInvitationSeen,
} from '../sms-pending-invitation-store'
import {
  SMSPendingInvitationStatus,
  SAFE_TO_DOWNLOAD_SMS_INVITATION,
} from '../type-sms-pending-invitation'
import { getInvitationLink, invitationDetailsRequest } from '../../api/api'
import { PENDING_CONNECTION_REQUEST_CODE } from '../../api/api-constants'
import { initialTestAction } from '../../common/type-common'
import { invitationReceived } from '../../invitation/invitation-store'
import {
  smsDownloadedPayload as payload,
  smsToken,
  getStore,
} from '../../../__mocks__/static-data'
import { HYDRATED } from '../../store/type-config-store'
import { lockSelectionRoute } from '../../common/route-constants'

describe('SMS Connection Request store', () => {
  const initialState = {}
  const smsToken = 'gm76ku'
  const store = getStore()

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
      smsPendingInvitationReceived(smsToken, payload)
    )

    expect(nextState).toMatchSnapshot()
  })

  it('should update store when invitation receive fail', () => {
    const invitationRequestedState = getPendingInvitationState(initialState)
    const nextState = smsPendingInvitationReducer(
      invitationRequestedState,
      smsPendingInvitationFail(smsToken, {
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
      smsPendingInvitationReceived(smsToken, payload)
    )
    const nextState = smsPendingInvitationReducer(
      afterReceived,
      smsPendingInvitationSeen(smsToken)
    )

    expect(nextState).toMatchSnapshot()
  })

  it('sms invitation download workflow should work fine if api returns success', () => {
    const gen = callSmsPendingInvitationRequest(
      getSmsPendingInvitation(smsToken)
    )

    expect(gen.next().value).toEqual(select(getCurrentScreen))
    // we are explicitly adding test dependency on getCurrentScreen
    // so that if someone changes this selector or store state/structure
    // they should know that this part of app breaks if we change this selector
    expect(getCurrentScreen(store.getState())).toMatchSnapshot()

    expect(gen.next(lockSelectionRoute).value).toEqual(
      take(SAFE_TO_DOWNLOAD_SMS_INVITATION)
    )

    expect(gen.next().value).toEqual(select(getHydrationState))
    // again add explicit test dependency on selector, so that this test breaks
    // if any change is done for selector or store/structure
    expect(getHydrationState(store.getState())).toMatchSnapshot()

    expect(gen.next(false).value).toEqual(take(HYDRATED))

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
      put(
        invitationReceived({
          payload: convertSmsPayloadToInvitation(payload),
        })
      )
    )

    expect(gen.next().value).toEqual(
      put(smsPendingInvitationReceived(smsToken, payload))
    )

    expect(gen.next().done).toBe(true)
  })

  //TODO : need to add test cases for multiple test cases whhen code is refactored.

  it('sms invitation download error should raise fail action', () => {
    const error = {
      code: 'OCS',
      message: 'sms connection pending request api error',
    }

    const gen = callSmsPendingInvitationRequest(
      getSmsPendingInvitation(smsToken)
    )

    // Need to find better way to share common tests for sagas
    // and common way forward

    expect(gen.next().value).toEqual(select(getCurrentScreen))
    // we are explicitly adding test dependency on getCurrentScreen
    // so that if someone changes this selector or store state/structure
    // they should know that this part of app breaks if we change this selector
    expect(getCurrentScreen(store.getState())).toMatchSnapshot()

    expect(gen.next(lockSelectionRoute).value).toEqual(
      take(SAFE_TO_DOWNLOAD_SMS_INVITATION)
    )

    expect(gen.next().value).toEqual(select(getHydrationState))
    // again add explicit test dependency on selector, so that this test breaks
    // if any change is done for selector or store/structure
    expect(getHydrationState(store.getState())).toMatchSnapshot()

    expect(gen.next(false).value).toEqual(take(HYDRATED))

    expect(gen.next().value).toEqual(select(getAgencyUrl))
    const agencyUrl = 'http://test-agency.com'

    expect(gen.next(agencyUrl).value).toEqual(
      call(getInvitationLink, {
        agencyUrl,
        smsToken,
      })
    )

    expect(gen.throw(new Error(JSON.stringify(error))).value).toEqual(
      put(smsPendingInvitationFail(smsToken, error))
    )

    expect(gen.next().done).toBe(true)
  })

  it('should reset store, if RESET action is raised', () => {
    const afterInvitationReceivedState = getPendingInvitationState(initialState)
    expect(
      smsPendingInvitationReducer(afterInvitationReceivedState, {
        type: 'RESET',
      })
    ).toMatchSnapshot()
  })
})

// @flow
import 'react-native'
import { Alert } from 'react-native'
import renderer from 'react-test-renderer'
import { put, take, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import configReducer, {
  watchSwitchErrorAlerts,
  changeServerEnvironment,
  toggleErrorAlerts,
  baseUrls,
  alreadyInstalledAction,
  hydrated,
  onEnvironmentSwitch,
  hydrateSwitchedEnvironmentDetails,
  changeEnvironment,
  onChangeEnvironmentUrl,
  changeEnvironmentUrl,
  vcxInitReset,
  vcxInitStart,
  vcxInitSuccess,
  vcxInitFail,
  initVcx,
  ensureVcxInitSuccess,
  getEnvironmentName,
} from '../config-store'
import {
  SERVER_ENVIRONMENT_CHANGED,
  SERVER_ENVIRONMENT,
  SWITCH_ERROR_ALERTS,
  STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
  ERROR_VCX_INIT_FAIL,
  HYDRATED,
  ERROR_VCX_PROVISION_FAIL,
  VCX_INIT_NOT_STARTED,
  VCX_INIT_SUCCESS,
  VCX_INIT_START,
} from '../type-config-store'
import {
  agencyDID,
  agencyUrl,
  agencyVerificationKey,
  poolConfig,
  validQrCodeEnvironmentSwitchUrl,
  userOneTimeInfo,
} from '../../../__mocks__/static-data'
import { downloadEnvironmentDetails } from '../../api/api'
import {
  RESET,
  REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS,
} from '../../common/type-common'
import {
  resetVcx as resetNative,
  createOneTimeInfo,
  init,
} from '../../bridge/react-native-cxs/RNCxs'
import { updatePushToken } from '../../push-notification/push-notification-store'
import { getPushToken } from '../../store/store-selector'
import { connectRegisterCreateAgentDone } from '../user/user-store'
import { homeRoute } from '../../common/route-constants'
import { secureGet, secureSet } from '../../services/storage'
import { getItem, setItem } from '../../services/secure-storage'

const getConfigStoreInitialState = () =>
  configReducer(undefined, { type: 'INITIAL_TEST_ACTION' })

describe('server environment should change', () => {
  let initialConfig = null
  const serializedEnvironmentDetail = JSON.stringify({
    poolConfig,
    agencyDID,
    agencyVerificationKey,
    agencyUrl,
  })

  beforeEach(() => {
    initialConfig = getConfigStoreInitialState()
  })

  it('initial app should always point to demo', () => {
    if (initialConfig) {
      expect(initialConfig.agencyUrl).toBe(baseUrls.DEMO.agencyUrl)
    }
  })

  it('to demo if previously it was set to sandbox', () => {
    const expectedConfig = {
      ...initialConfig,
      ...baseUrls[SERVER_ENVIRONMENT.DEMO],
    }

    if (initialConfig) {
      expect(
        configReducer(
          initialConfig,
          changeServerEnvironment(SERVER_ENVIRONMENT.DEMO)
        )
      ).toEqual(expectedConfig)
    } else {
      // we fail the test if we don't get any initial state
      expect(1).toBe(2)
    }
  })

  it('toggle showErrorAlerts if action is raised more than 3 times', () => {
    const gen = watchSwitchErrorAlerts()
    for (let i = 0; i < 4; i++) {
      expect(gen.next().value).toEqual(take(SWITCH_ERROR_ALERTS))
    }

    // after 3 times, it should raise an action to toggle showErrorAlerts
    gen.next()
    expect(gen.next().value).toEqual(put(toggleErrorAlerts(true)))
  })

  it('should store switched environment details', () => {
    const gen = onEnvironmentSwitch(
      changeEnvironment(agencyUrl, agencyDID, agencyVerificationKey, poolConfig)
    )
    let switchedEnvironmentDetails = {
      poolConfig,
      agencyDID,
      agencyVerificationKey,
      agencyUrl,
    }
    expect(gen.next().value).toEqual(
      call(
        setItem,
        STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
        JSON.stringify(switchedEnvironmentDetails)
      )
    )
    expect(gen.next().value).toEqual(take(VCX_INIT_SUCCESS))
    expect(gen.next().value).toEqual(
      call(
        secureSet,
        STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
        serializedEnvironmentDetail
      )
    )
  })

  it('should hydrate switched environment details', () => {
    const gen = hydrateSwitchedEnvironmentDetails()
    expect(gen.next().value).toEqual(
      call(secureGet, STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL)
    )
    let switchedEnvironmentDetails = {
      poolConfig,
      agencyDID,
      agencyVerificationKey,
      agencyUrl,
    }
    expect(gen.next(serializedEnvironmentDetail).value).toEqual(
      put(
        changeEnvironment(
          agencyUrl,
          agencyDID,
          agencyVerificationKey,
          poolConfig
        )
      )
    )
  })

  // Below test is written for switching environment with scanning QR code
  // we are not using this feature as of now, we will come to this feature later
  // when we add this with vcx, and then we will un-skip this test
  xit('should change environment via url, show success alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert')
    const gen = onChangeEnvironmentUrl(
      changeEnvironmentUrl(validQrCodeEnvironmentSwitchUrl)
    )

    expect(gen.next().value).toEqual(
      call(downloadEnvironmentDetails, validQrCodeEnvironmentSwitchUrl)
    )

    const environmentDetails = {
      agencyDID,
      agencyUrl,
      agencyVerificationKey,
      poolConfig,
    }
    // delete stored data, not interested in actual calls
    // those tests are being taken care in other test
    // TODO: Change index value to constant that better describes what the number represents
    // for (let index = 0; index < 6; index++) {
    //   gen.next()
    // }

    // expect(gen.next().value).toEqual(
    //   put({ type: REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS })
    // )
    // gen.next()
    expect(gen.next(environmentDetails).value).toEqual(put({ type: RESET }))
    expect(gen.next().value).toEqual(
      put(
        changeEnvironment(
          agencyUrl,
          agencyDID,
          agencyVerificationKey,
          poolConfig
        )
      )
    )
    expect(gen.next().value).toEqual(select(getPushToken))
    const pushToken = 'token'
    expect(gen.next(pushToken).value).toEqual(put(updatePushToken(pushToken)))
    expect(gen.next().value).toEqual(call(resetNative, true))
    expect(gen.next().value).toEqual(put(vcxInitReset()))

    expect(gen.next().done).toBe(true)

    expect(alertSpy).toHaveBeenCalledTimes(1)

    alertSpy.mockReset()
    alertSpy.mockRestore()
  })

  it('should not change environment via url if downloaded data is not correct', () => {
    const alertSpy = jest.spyOn(Alert, 'alert')
    const gen = onChangeEnvironmentUrl(
      changeEnvironmentUrl(validQrCodeEnvironmentSwitchUrl)
    )

    expect(gen.next().value).toEqual(
      call(downloadEnvironmentDetails, validQrCodeEnvironmentSwitchUrl)
    )
    const invalidEnvironmentDetails = {
      agencyDID,
      agencyUrl,
      agencyVerificationKey,
    }

    expect(gen.next(invalidEnvironmentDetails).done).toBe(true)

    expect(alertSpy).toHaveBeenCalledTimes(1)

    alertSpy.mockReset()
    alertSpy.mockRestore()
  })

  it('should show alert with error message if any error occurs', () => {
    const alertSpy = jest.spyOn(Alert, 'alert')
    const gen = onChangeEnvironmentUrl(
      changeEnvironmentUrl(validQrCodeEnvironmentSwitchUrl)
    )

    expect(gen.next().value).toEqual(
      call(downloadEnvironmentDetails, validQrCodeEnvironmentSwitchUrl)
    )

    gen.throw(new Error('Some error'))

    expect(alertSpy).toHaveBeenCalledTimes(1)

    alertSpy.mockReset()
    alertSpy.mockRestore()
  })
})

describe('reducer:config', () => {
  it('action:VCX_INIT_NOT_STARTED', () => {
    const initialState = getConfigStoreInitialState()
    expect(configReducer(initialState, vcxInitReset())).toMatchSnapshot()
  })

  it('action:VCX_INIT_START', () => {
    const initialState = getConfigStoreInitialState()
    expect(configReducer(initialState, vcxInitStart())).toMatchSnapshot()
  })

  it('action:VCX_INIT_SUCCESS', () => {
    const initialState = getConfigStoreInitialState()
    expect(configReducer(initialState, vcxInitSuccess())).toMatchSnapshot()
  })

  it('action:VCX_INIT_FAIL', () => {
    const initialState = getConfigStoreInitialState()
    const error = ERROR_VCX_INIT_FAIL('error from test')
    expect(configReducer(initialState, vcxInitFail(error))).toMatchSnapshot()
  })
})

describe('config-store:saga', () => {
  const notHydratedNoOneTimeInfoState = {
    config: {
      isHydrated: false,
      vcxInitializationState: VCX_INIT_NOT_STARTED,
    },
    user: {},
    route: {
      currentScreen: homeRoute,
    },
  }
  const agencyConfig = {
    agencyUrl,
    agencyDID,
    agencyVerificationKey,
    poolConfig,
  }

  it('initVcx, success', () => {
    return expectSaga(initVcx)
      .withState(notHydratedNoOneTimeInfoState)
      .dispatch({ type: HYDRATED })
      .provide([
        [matchers.call.fn(createOneTimeInfo, agencyConfig), userOneTimeInfo],
        [matchers.call.fn(init, { ...userOneTimeInfo, ...agencyConfig }), true],
      ])
      .put(connectRegisterCreateAgentDone(userOneTimeInfo))
      .put(vcxInitSuccess())
      .run()
  })

  it('initVcx, fail provision', () => {
    const errorMessage = 'test provision fail error'
    const failProvisionError = new Error(errorMessage)

    return expectSaga(initVcx)
      .withState(notHydratedNoOneTimeInfoState)
      .dispatch({ type: HYDRATED })
      .provide([
        [
          matchers.call.fn(createOneTimeInfo, agencyConfig),
          throwError(failProvisionError),
        ],
      ])
      .put(vcxInitFail(ERROR_VCX_PROVISION_FAIL(errorMessage)))
      .run()
  })

  it('initVcx, fail init', () => {
    const errorMessage = 'test init fail error'
    const failInitError = new Error(errorMessage)

    return expectSaga(initVcx)
      .withState(notHydratedNoOneTimeInfoState)
      .dispatch({ type: HYDRATED })
      .provide([
        [matchers.call.fn(createOneTimeInfo, agencyConfig), userOneTimeInfo],
        [
          matchers.call.fn(init, { ...userOneTimeInfo, ...agencyConfig }),
          throwError(failInitError),
        ],
      ])
      .put(connectRegisterCreateAgentDone(userOneTimeInfo))
      .put(vcxInitFail(ERROR_VCX_INIT_FAIL(errorMessage)))
      .run()
  })

  it('ensureVcxInitSuccess, not initialized', () => {
    return expectSaga(ensureVcxInitSuccess)
      .withState(notHydratedNoOneTimeInfoState)
      .dispatch({ type: VCX_INIT_SUCCESS })
      .put(vcxInitStart())
      .run()
  })

  it('ensureVcxInitSuccess, already started', () => {
    return expectSaga(ensureVcxInitSuccess)
      .withState({
        config: {
          vcxInitializationState: VCX_INIT_START,
        },
      })
      .dispatch({ type: VCX_INIT_SUCCESS })
      .not.put(vcxInitStart())
      .run()
  })

  it('ensureVcxInitSuccess, already initialized', () => {
    return expectSaga(ensureVcxInitSuccess)
      .withState({
        config: {
          vcxInitializationState: VCX_INIT_SUCCESS,
        },
      })
      .not.take(VCX_INIT_SUCCESS)
      .run()
  })

  it('fn:getEnvironmentName', () => {
    expect(getEnvironmentName(getConfigStoreInitialState())).toMatchSnapshot()
  })
})

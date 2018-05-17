// @flow
import 'react-native'
import { Alert } from 'react-native'
import renderer from 'react-test-renderer'
import { AsyncStorage } from 'react-native'
import { put, take, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import configReducer, {
  watchSwitchErrorAlerts,
  changeServerEnvironment,
  toggleErrorAlerts,
  baseUrls,
  hydrateConfig,
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
import { RESET } from '../../common/type-common'
import {
  reset as resetNative,
  createOneTimeInfo,
  init,
} from '../../bridge/react-native-cxs/RNCxs'
import { updatePushToken } from '../../push-notification/push-notification-store'
import { getPushToken } from '../../store/store-selector'
import { connectRegisterCreateAgentDone } from '../user/user-store'

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
    expect(gen.next().value).toEqual(
      call(
        AsyncStorage.setItem,
        STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
        serializedEnvironmentDetail
      )
    )
  })

  it('should hydrate switched environment details', () => {
    const gen = hydrateSwitchedEnvironmentDetails()
    expect(gen.next().value).toEqual(
      call(AsyncStorage.getItem, STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL)
    )
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

  it('should change environment via url, show success alert', () => {
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
    gen.next(environmentDetails)
    for (let index = 0; index < 11; index++) {
      gen.next()
    }

    expect(gen.next().value).toEqual(put({ type: RESET }))
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
    expect(gen.next().value).toEqual(call(resetNative, poolConfig))
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

describe('hydration should work correctly', () => {
  // TODO Write this test in proper way and check for all generators and values
  it('should raise correct action with correct data', () => {
    const gen = hydrateConfig()
    // call async storage to get data
    gen.next()
    // dispatch an action to tell app was not already installed
    gen.next()
    // clear app setup settings
    gen.next()
    gen.next()
    // clear app lock settings
    gen.next()

    // hydrate connections and push token
    gen.next()
    // hydrate lock settings
    gen.next()
    // save data in async storage
    gen.next()

    gen.next()
    gen.next()
    gen.next()

    // hydrate user store
    gen.next()
    gen.next()
    gen.next()
    // hydrate themes
    gen.next()
    gen.next()
    gen.next()
    // hydrate claimMap from claim store
    gen.next()
    gen.next()

    // hydrate app success
    gen.next()
    // hydrate user switched environment details
    gen.next()
    gen.next()
    gen.next()
    gen.next()
    gen.next()
    gen.next()
    gen.next()

    expect(gen.next().value).toEqual(put(hydrated()))
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
})

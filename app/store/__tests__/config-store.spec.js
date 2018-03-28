// @flow
import 'react-native'
import { Alert } from 'react-native'
import renderer from 'react-test-renderer'
import { AsyncStorage } from 'react-native'
import { put, take, call, select } from 'redux-saga/effects'
import configReducer, {
  watchChangeEnvironmentToDemo,
  watchChangeEnvironmentToSandbox,
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
} from '../config-store'
import {
  SERVER_ENVIRONMENT_CHANGED_DEMO,
  SERVER_ENVIRONMENT_CHANGED_SANDBOX,
  SERVER_ENVIRONMENT_CHANGED,
  SERVER_ENVIRONMENT,
  SWITCH_ERROR_ALERTS,
  STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL,
} from '../type-config-store'
import {
  agencyDID,
  agencyUrl,
  agencyVerificationKey,
  poolConfig,
  validQrCodeEnvironmentSwitchUrl,
} from '../../../__mocks__/static-data'
import { downloadEnvironmentDetails } from '../../api/api'
import { RESET } from '../../common/type-common'
import { reset as resetNative } from '../../bridge/react-native-cxs/RNCxs'
import { updatePushToken } from '../../push-notification/push-notification-store'
import { getPushToken } from '../../store/store-selector'

describe('server environment should change', () => {
  let initialConfig = null
  const serializedEnvironmentDetail = JSON.stringify({
    poolConfig,
    agencyDID,
    agencyVerificationKey,
    agencyUrl,
  })

  beforeEach(() => {
    initialConfig = configReducer(undefined, { type: 'INITIAL_TEST_ACTION' })
  })

  it('initial app should always point to demo', () => {
    if (initialConfig) {
      expect(initialConfig.agencyUrl).toBe(baseUrls.DEMO.agencyUrl)
    }
  })

  it('to demo when demo action is raised more than 2 times', () => {
    const gen = watchChangeEnvironmentToDemo()
    // demo saga should wait for demo change event 3 times
    for (let i = 0; i < 4; i++) {
      expect(gen.next().value).toEqual(take(SERVER_ENVIRONMENT_CHANGED_DEMO))
    }

    // after 3 times, it should raise an action to change server environment to demo
    expect(gen.next().value).toEqual(
      put(changeServerEnvironment(SERVER_ENVIRONMENT.DEMO))
    )
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
    for (let index = 0; index < 5; index++) {
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

    expect(gen.next().value).toEqual(put(hydrated()))
  })
})

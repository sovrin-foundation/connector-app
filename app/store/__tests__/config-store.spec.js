// @flow
import 'react-native'
import renderer from 'react-test-renderer'
import { AsyncStorage } from 'react-native'
import { put, take, call } from 'redux-saga/effects'
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
} from '../../../__mocks__/static-data'

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

  it('initial app should always point to staging', () => {
    if (initialConfig) {
      expect(initialConfig.agencyUrl).toBe(baseUrls.STAGING.agencyUrl)
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

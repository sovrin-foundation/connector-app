import 'react-native'
import renderer from 'react-test-renderer'
import { put, take } from 'redux-saga/effects'
import configReducer, {
  watchChangeEnvironmentToDemo,
  watchChangeEnvironmentToSandbox,
  changeServerEnvironment,
  SERVER_ENVIRONMENT_CHANGED_DEMO,
  SERVER_ENVIRONMENT_CHANGED_SANDBOX,
  SERVER_ENVIRONMENT_CHANGED,
  SERVER_ENVIRONMENT,
  baseUrls,
  hydrateConfig,
  alreadyInstalledAction,
  hydrated,
} from '../config-store'

describe('server environment should change', () => {
  let initialConfig = {}

  beforeAll(() => {
    initialConfig = configReducer(undefined, { type: 'INITIAL_TEST_ACTION' })
  })

  it('to demo when demo action is raised more than 2 times', () => {
    const gen = watchChangeEnvironmentToDemo()
    // demo saga should wait for demo change event 3 times
    for (let i = 0; i < 4; i++) {
      expect(gen.next().value).toEqual(take(SERVER_ENVIRONMENT_CHANGED_DEMO))
    }

    // after 3 times, it should raise an action to change server enviornment to demo
    expect(gen.next().value).toEqual(
      put(changeServerEnvironment(SERVER_ENVIRONMENT.DEMO))
    )
  })

  it('to demo if previously it was set to sandbox', () => {
    const expectedConfig = {
      ...initialConfig,
      agencyUrl: baseUrls[SERVER_ENVIRONMENT.DEMO].agencyUrl,
      callCenterUrl: baseUrls[SERVER_ENVIRONMENT.DEMO].callCenterUrl,
    }

    expect(
      configReducer(initialConfig, {
        type: SERVER_ENVIRONMENT_CHANGED,
        serverEnvironment: SERVER_ENVIRONMENT.DEMO,
      })
    ).toEqual(expectedConfig)
  })
})

describe('hydration should work correctly', () => {
  it('should raise correct action with correct data', () => {
    const gen = hydrateConfig()
    // call async storage to get data
    gen.next()
    // dispatch an action to tell app was not already installed
    gen.next()
    // hydrate connections and push token
    gen.next()
    // save data in async storage
    gen.next()
    // now we should get hydrated action
    expect(gen.next().value).toEqual(put(hydrated()))
  })
})

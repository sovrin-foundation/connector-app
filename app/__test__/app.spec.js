// @flow
import 'react-native'
import React from 'react'
import { BackHandler, StatusBar, ToastAndroid } from 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ConnectMeApp } from './../app'
import { delay } from 'redux-saga'
import { NativeModules } from 'react-native'
import {
  aboutAppRoute,
  lockPinSetupHomeRoute,
  settingsTabRoute,
  lockAuthorizationHomeRoute,
  homeRoute,
} from '../common'
import store from './../store'

describe('<App/>', () => {
  describe('in ios environment.', () => {
    let tree = null
    let spySetBackgroundColor = null

    beforeAll(() => {
      spySetBackgroundColor = jest.spyOn(StatusBar, 'setBackgroundColor')
      tree = renderer.create(<ConnectMeApp />)
    })

    afterEach(() => {
      spySetBackgroundColor && spySetBackgroundColor.mockReset()
      spySetBackgroundColor && spySetBackgroundColor.mockRestore()
    })

    it('should render properly and snapshot should match', () => {
      expect(tree && tree.toJSON()).toMatchSnapshot()
    })

    it(`should not call BackHandler addEventListner`, () => {
      expect(BackHandler.addEventListener).not.toHaveBeenCalled()
    })

    it('should not call setBackgroundColor', () => {
      expect(spySetBackgroundColor).not.toHaveBeenCalled()
    })
  })
  describe('in android environment.', () => {
    let tree = null
    let spySetBackgroundColor = null

    beforeEach(() => {
      spySetBackgroundColor = jest.spyOn(StatusBar, 'setBackgroundColor')
      const platform = jest.mock('Platform', () => {
        const Platform = jest.requireActual('Platform')
        Platform.OS = 'android'
        return Platform
      })
      tree = renderer.create(<ConnectMeApp />)
    })

    afterEach(() => {
      spySetBackgroundColor && spySetBackgroundColor.mockReset()
      spySetBackgroundColor && spySetBackgroundColor.mockRestore()
    })

    it(`should have been called BackHandler addEventListner`, () => {
      expect(BackHandler.addEventListener).toHaveBeenCalled()
    })

    it('should have been called setBackgroundColor', () => {
      expect(spySetBackgroundColor).toHaveBeenCalled()
    })
    it(`should call BackHandler.removeEventListener before unmount`, () => {
      let instance = tree && tree.root && tree.root.instance
      instance && instance.componentWillUnmount()
      expect(BackHandler.removeEventListener).toHaveBeenCalled()
    })

    it(`should return false if backbutton was clicked in one of backButtonDisableRoutes`, () => {
      let instance = tree && tree.root && tree.root.instance
      if (instance) {
        instance.currentRouteKey = 'key'
        instance.currentRoute = aboutAppRoute
      }
      expect(instance && instance.handleBackButtonClick()).toBe(false)
    })
    // lockPinSetupHomeRoute
    it(`should redirect to settingsTab screen if user has pressed back button from lockPinSetup screen if user has already setup `, () => {
      let instance = tree && tree.root && tree.root.instance
      const dispatch = jest.fn()
      if (instance) {
        instance.currentRouteParams = { existingPin: true }
        instance.navigatorRef = { dispatch }
        instance.currentRouteKey = 'key'
        instance.currentRoute = lockPinSetupHomeRoute
      }
      expect(instance && instance.handleBackButtonClick()).toBe(true)
      expect(dispatch).toMatchSnapshot()
      dispatch.mockReset()
      dispatch.mockRestore()
    })

    it(`should redirect to lockSelectionRoute screen if user has no existing pin ands pressed back button from lockPinSetup screen `, () => {
      let instance = tree && tree.root && tree.root.instance
      const dispatch = jest.fn()
      if (instance) {
        instance.currentRouteParams = { existingPin: false }
        instance.navigatorRef = { dispatch }
        instance.currentRouteKey = 'key'
        instance.currentRoute = lockPinSetupHomeRoute
      }
      expect(instance && instance.handleBackButtonClick()).toBe(true)
      expect(dispatch).toMatchSnapshot()
      dispatch.mockReset()
      dispatch.mockRestore()
    })
    it(`should call onAvoid method if user has pressed back button in lockAuthorization screen`, () => {
      let instance = tree && tree.root && tree.root.instance
      const onAvoid = jest.fn()
      if (instance) {
        instance.currentRouteParams = { onAvoid }
        instance.currentRouteKey = 'key'
        instance.currentRoute = lockAuthorizationHomeRoute
      }
      expect(instance && instance.handleBackButtonClick()).toBe(false)
      expect(onAvoid).toHaveBeenCalled()
      onAvoid.mockReset()
      onAvoid.mockRestore()
    })

    it(`should call onBackPressExit method if user has pressed back button in home screen`, () => {
      let instance = tree && tree.root && tree.root.instance

      if (instance) {
        instance.currentRouteKey = 'key'
        instance.currentRoute = homeRoute
      }
      expect(instance && instance.exitTimeout).toBe(0)
      expect(instance && instance.handleBackButtonClick()).toBe(true)
      expect(instance && instance.exitTimeout).not.toBe(0)
    })

    it(`fn:navigationChangeHandler testing`, () => {
      let instance = tree && tree.root && tree.root.instance
      const dispatch = jest.spyOn(store, 'dispatch')
      if (instance) {
        instance.navigationChangeHandler(
          {
            index: 0,
            routes: [{ key: 'key', params: {}, routeName: 'routeName' }],
          },
          {
            index: 0,
            routes: [
              { key: 'updatedKey', params: {}, routeName: 'updatedRouteName' },
            ],
          }
        )
        expect(instance.currentRouteKey).toBe('updatedKey')
        expect(instance.currentRoute).toBe('updatedRouteName')
      }
      expect(dispatch).toHaveBeenCalled()
      dispatch.mockReset()
      dispatch.mockRestore()
    })

    it(`fn:navigationChangeHandler testing`, () => {
      let instance = tree && tree.root && tree.root.instance
      const dispatch = jest.spyOn(store, 'dispatch')
      if (instance) {
        instance.navigationChangeHandler(
          {
            index: 0,
            routes: [{ key: 'key', params: {}, routeName: 'routeName' }],
          },
          {
            index: 0,
            routes: [
              {
                index: 0,
                routes: [
                  {
                    key: 'updatedKey',
                    params: {},
                    routeName: 'updatedRouteName',
                  },
                ],
              },
            ],
          }
        )
        expect(instance.currentRouteKey).toBe('updatedKey')
        expect(instance.currentRoute).toBe('updatedRouteName')
      }
      expect(dispatch).toHaveBeenCalled()
      dispatch.mockReset()
      dispatch.mockRestore()
    })

    it(`should dispatch navigation action`, () => {
      let instance = tree && tree.root && tree.root.instance
      const dispatch = jest.fn()
      if (instance) {
        instance.navigatorRef = { dispatch }
      }
      instance && instance.navigateToRoute('routeName', { existingPin: true })
      expect(dispatch).toMatchSnapshot()
      dispatch.mockReset()
      dispatch.mockRestore()
    })

    it('user should exit from app if back button pressed twice with less than 2000 milliseconds gap', async () => {
      let instance = tree && tree.root && tree.root.instance
      const spy = jest.spyOn(ToastAndroid, 'show')
      const { RNIndy } = NativeModules
      instance && instance.onBackPressExit()
      expect(spy).toHaveBeenCalled()
      await delay(1000)
      instance && instance.onBackPressExit()
      expect(RNIndy.exitAppAndroid).toHaveBeenCalled()
      RNIndy.exitAppAndroid.mockClear()
      spy.mockReset()
      spy.mockRestore()
    })
  })
})

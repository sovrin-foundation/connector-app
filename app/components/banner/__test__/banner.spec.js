// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import DefaultBanner, { Banner } from './../banner'
import moment from 'moment'
import { getStore, getNavigation } from './../../../../__mocks__/static-data'

describe('<Banner/>', () => {
  let props
  let store

  let getProps = () => ({
    walletBackup: jest.fn(),
    offline: false,
    showBanner: false,
    lastSuccessfulBackupTimeStamp: '',
    navigation: getNavigation(),
    promptBackupBanner: jest.fn(),
  })

  let Store = () => ({
    ...getStore(),
    getState: () => ({
      ...getStore().getState(),
      offline: {
        offline: true,
      },
    }),
  })

  let OfflineStore = () => ({
    ...getStore(),
    getState: () => ({
      ...getStore().getState(),
      offline: {
        offline: false,
      },
    }),
  })

  beforeEach(() => {
    props = getProps()
    store = Store()
  })

  it('should display nothing ', () => {
    const wrapper = renderer.create(<Banner {...props} />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should display offline banner', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <DefaultBanner
            walletBackup={jest.fn()}
            offline={true}
            showBanner={false}
            lastSuccessfulBackupTimeStamp={''}
            navigation={getNavigation()}
            promptBackupBanner={jest.fn()}
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should display "Set up data recovery now!" FIRST_BACKUP_TITLE text', () => {
    store = {
      ...getStore(),
      getState: () => ({
        ...getStore().getState(),
        offline: {
          offline: false,
        },
        backup: {
          ...getStore().getState().backup,
          lastSuccessfulBackup: '',
        },
      }),
    }
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <DefaultBanner {...props} offline={false} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should display "You have new data that is not backed up" SUBSEQUENT_BACKUP_TITLE text', () => {
    store = OfflineStore()
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <DefaultBanner {...props} offline={false} />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

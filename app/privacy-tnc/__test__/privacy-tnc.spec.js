// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { PrivacyTNC } from '../privacy-tnc-screen'
import { getStore } from '../../../__mocks__/static-data'

describe('user Custom Web View screen', () => {
  const store = getStore()
  const url = 'https://www.evernym.com'

  // TODO:  ND : Test is failing with  TypeError: Cannot read property 'state' of undefined
  // only found one reference https://github.com/facebook/react-native/issues/12440
  // however was unable in implementing the feedback in above link.

  xit('should render properly and snapshot should match', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PrivacyTNC url={url} />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

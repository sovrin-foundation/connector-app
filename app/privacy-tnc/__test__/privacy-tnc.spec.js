// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { PrivacyTNC } from '../privacy-tnc-screen'
import { getNavigation } from '../../../__mocks__/static-data'

describe('Privacy and TNC screen', () => {
  const navigation = getNavigation({
    url: PrivacyTNC.INFO_TYPE.PRIVACY,
  })

  it('should render properly and snapshot should match', () => {
    const tree = renderer
      .create(<PrivacyTNC navigation={navigation} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

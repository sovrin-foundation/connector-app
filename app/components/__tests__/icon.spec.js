// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Icon } from '../../components'

describe('<Icon />', () => {
  it('should match snapshot', () => {
    // icon should have only icon props
    // and rest of the props should be passed to CustomView
    const wrapper = renderer
      .create(
        <Icon
          src={require('../../images/cbTest.png')}
          extraLarge
          testID="test-icon-test"
          halo
          resizeMode="cover"
          style={{ fontSize: 15 }}
          center
          iconStyle={[{ width: 90 }]}
        />
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { CustomView } from '../../components'
import { PADDING_VERTICAL } from './../../common/styles/constant'

describe('<CustomView />', () => {
  it('doubleVerticalSpace should overwrite verticalSpace style if both were provided as props to customView', () => {
    // icon should have only icon props
    // and rest of the props should be passed to CustomView
    const wrapper = renderer
      .create(<CustomView verticalSpace doubleVerticalSpace />)
      .toJSON()

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.props.style.paddingVertical).toBe(PADDING_VERTICAL * 2)
  })
})

// @flow
import React from 'react'
import 'react-native'
import { ImageColorPicker } from '../image-color-picker'
import renderer from 'react-test-renderer'

function getProps() {
  return {
    imageType: 'jpeg',
    imageUrl: 'https://image.url',
    updateConnectionTheme: jest.fn(),
  }
}

function setup() {
  const props = getProps()
  const wrapper = renderer.create(<ImageColorPicker {...props} />)
  const instance = wrapper.root.instance

  return {
    props,
    wrapper,
    instance,
  }
}

describe('<ImageColorPicker />', () => {
  it('should render properly', () => {
    const { instance, wrapper } = setup()
    instance.setState({ imageBlob: 'someblob' })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})

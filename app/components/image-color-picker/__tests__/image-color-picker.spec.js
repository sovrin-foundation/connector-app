// @flow
import React from 'react'
import 'react-native'
import {
  ImageColorPicker,
  isAllowedColor,
  getImageType,
} from '../image-color-picker'
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

  it('should pick default color if color is light', () => {
    let color = [255, 255, 255]
    expect(isAllowedColor(color)).toBe(false)
    color = [224, 224, 224]
    expect(isAllowedColor(color)).toBe(false)
    color = [229, 255, 204]
    expect(isAllowedColor(color)).toBe(false)
    color = [0, 255, 255]
    expect(isAllowedColor(color)).toBe(false)
    color = [255, 248, 220]
    expect(isAllowedColor(color)).toBe(false)
    color = [240, 255, 255]
    expect(isAllowedColor(color)).toBe(false)
    color = [255, 255, 240]
    expect(isAllowedColor(color)).toBe(false)
    color = [245, 245, 245]
    expect(isAllowedColor(color)).toBe(false)
  })

  it('should pick correct image extension', () => {
    let imageUrl = 'a.jpG'
    expect(getImageType(imageUrl)).toBe('JPEG')
    imageUrl = 'a.jpG?'
    expect(getImageType(imageUrl)).toBe('JPEG')
  })
})

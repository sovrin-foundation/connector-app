// @flow
import React from 'react'
import 'react-native'
import { ImageColorPicker } from '../image-color-picker'
import renderer from 'react-test-renderer'

function props() {
  return {
    imageType: 'jpeg',
    imageUrl: 'https://image.url',
    updateActiveConnectionTheme: jest.fn(),
  }
}

describe('<ImageColorPicker />', () => {
  it('should render properly', () => {
    const imageColorPicker = renderer
      .create(<ImageColorPicker {...props()} />)
      .toJSON()
    expect(imageColorPicker).toMatchSnapshot()
  })
})

import React from 'react'
import 'react-native'
import { ConnectionTheme } from '../connection-theme'
import renderer from 'react-test-renderer'
import { color } from '../../../common/styles/constant'

function props() {
  return {
    connectionTheme: {
      primary: `rgba(${color.actions.button.primary.rgba})`,
      secondary: `rgba(${color.actions.button.secondary.rgba})`,
    },
  }
}

describe('<ConnectionTheme />', () => {
  it('should render default theme properly', () => {
    const connectionTheme = renderer
      .create(<ConnectionTheme {...props()} />)
      .toJSON()
    expect(connectionTheme).toMatchSnapshot()
  })
})

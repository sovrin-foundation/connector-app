// @flow
import React from 'react'
import 'react-native'
import { ConnectionTheme } from '../connection-theme'
import renderer from 'react-test-renderer'
import { color } from '../../../common/styles/constant'
import { Button } from 'react-native-elements'
import empty from '../../../common/empty'

function props() {
  return {
    connectionTheme: {
      primary: `rgba(${color.actions.button.primary.rgba})`,
      secondary: `rgba(${color.actions.button.secondary.rgba})`,
    },
    logoUrl: 'logoUrl',
    secondary: 'secondary',
    children: [Button],
    backgroundColor: '',
    style: empty,
    disabled: true,
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

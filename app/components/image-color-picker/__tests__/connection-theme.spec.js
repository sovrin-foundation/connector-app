import React from 'react'
import 'react-native'
import { ConnectionTheme } from '../connection-theme'
import renderer from 'react-test-renderer'
import { color } from '../../../common/styles/constant'

function props() {
  return { activeConnectionColor: color.actions.primaryRGB }
}

describe('<ConnectionTheme />', () => {
  it('should render default shade theme properly', () => {
    const connectionTheme = renderer
      .create(<ConnectionTheme {...props()} />)
      .toJSON()
    expect(connectionTheme).toMatchSnapshot()
  })
})

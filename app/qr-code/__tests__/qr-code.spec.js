import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { QRCodeScannerScreen } from '../qr-code'

describe('<QRScannerScreen />', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<QRCodeScannerScreen />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

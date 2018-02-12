// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { PIN_SETUP_STATE } from '../type-lock'
import { LockFingerprintSetup } from '../lock-fingerprint-setup'
import { lockPinSetupRoute } from '../../common'
import { getNavigation } from '../../../__mocks__/static-data'

describe('<LockFingerprintSetup />', () => {
  const getProps = () => ({
    navigation: getNavigation({ touchIdActive: true }),
    touchIdActive: true,
    fromSettings: false,
    disableTouchIdAction: jest.fn(),
    enableTouchIdAction: jest.fn(),
  })

  const options = {
    createNodeMock: element => {
      return {
        clear: () => {
          cleared = true
        },
      }
    },
  }

  let component
  let props
  let cleared

  beforeEach(() => {
    props = getProps()
    component = renderer.create(<LockFingerprintSetup {...props} />, options)
  })

  it('should render touchId modal', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('should test touchId handler is called', () => {
    let tree = component.toJSON()
    let instance = component.getInstance()
    //manually set to true"
    instance.touchIdHandler()
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

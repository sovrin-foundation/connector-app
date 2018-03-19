// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { SCAN_STATUS } from '../type-qr-scanner'
import QRScanner from '../qr-scanner'
import {
  qrData,
  validQrCodeEnvironmentSwitchUrl,
} from '../../../../__mocks__/static-data'

describe('<QRScanner />', () => {
  const getProps = () => ({
    onClose: jest.fn(),
    onRead: jest.fn(),
    onEnvironmentSwitchUrl: jest.fn(),
  })

  function setup() {
    const props = getProps()
    const wrapper = renderer.create(<QRScanner {...props} />)
    const instance = wrapper.getInstance()
    return {
      ...props,
      instance,
      wrapper,
    }
  }

  it('should match snapshot', () => {
    const { wrapper } = setup()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should call onRead once QR code read is successful', () => {
    jest.useFakeTimers()
    const { onRead, instance } = setup()

    const qrReadEvent = {
      data: JSON.stringify(qrData),
    }

    instance.onRead(qrReadEvent)
    expect(onRead).toHaveBeenCalledWith(expect.objectContaining(qrData))
    expect(instance.state.scanStatus).toBe(SCAN_STATUS.SUCCESS)

    jest.runAllTimers()
    // qr scanner should be reactivated after all timers are done
    expect(instance.state.scanStatus).toBe(SCAN_STATUS.SCANNING)
  })

  it('should set state to fail if QR code is not correct', () => {
    jest.useFakeTimers()

    const { instance } = setup()

    instance.onRead({ data: '' })
    expect(instance.state.scanStatus).toBe(SCAN_STATUS.FAIL)

    jest.runAllTimers()

    expect(instance.state.scanStatus).toBe(SCAN_STATUS.SCANNING)
  })

  it('should call onEnvironmentSwitchUrl if it reads correct environment switcher url', () => {
    jest.useFakeTimers()
    const { onEnvironmentSwitchUrl, instance } = setup()

    instance.onRead({ data: validQrCodeEnvironmentSwitchUrl })
    expect(onEnvironmentSwitchUrl).toHaveBeenCalledWith({
      name: 'dev',
      url: validQrCodeEnvironmentSwitchUrl,
    })
    expect(instance.state.scanStatus).toBe(SCAN_STATUS.SUCCESS)

    jest.runAllTimers()

    expect(instance.state.scanStatus).toBe(SCAN_STATUS.SCANNING)
  })
})

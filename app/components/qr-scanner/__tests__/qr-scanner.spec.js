// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { SCAN_STATUS } from '../type-qr-scanner'
import QRScanner from '../qr-scanner'

describe('<QRScanner />', () => {
  const props = () => ({
    onClose: jest.fn(),
    onRead: jest.fn(),
  })

  it('should match snapshot', () => {
    const { onClose, onRead } = props()
    const wrapper = renderer
      .create(<QRScanner onClose={onClose} onRead={onRead} />)
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onRead once QR code read is successful', () => {
    jest.useFakeTimers()
    const { onClose, onRead } = props()
    const instance = renderer
      .create(<QRScanner onClose={onClose} onRead={onRead} />)
      .getInstance()

    const qrData = {
      lu: 'http://logourl.com',
      rid: 'requestid',
      sakdp: 'senderAgentKeyDlgProof',
      sn: 'senderName',
      tn: 'targetName',
      sD: 'senderDID',
      sVk: 'senderVerificationKey',
      e: 'https://remoteendpoint.com/agent',
    }
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

    const { onClose, onRead } = props()
    const instance = renderer
      .create(<QRScanner onClose={onClose} onRead={onRead} />)
      .getInstance()

    instance.onRead({ data: '' })
    expect(instance.state.scanStatus).toBe(SCAN_STATUS.FAIL)

    jest.runAllTimers()

    expect(instance.state.scanStatus).toBe(SCAN_STATUS.SCANNING)
  })
})

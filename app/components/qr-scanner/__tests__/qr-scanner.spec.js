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
      id: 'yta2odh',
      s: {
        n: 'ent-name',
        dp: {
          d: 'N2Uyi6SVsHZq1VWXuA3EMg',
          k: 'CTfF2sZ5q4oPcBvTP75pgx3WGzYiLSTwHGg9zUsJJegi',
          s:
            '/FxHMzX8JaH461k1SI5PfyxF5KwBAe6VlaYBNLI2aSZU3APsiWBfvSC+mxBYJ/zAhX9IUeTEX67fj+FCXZZ2Cg==',
        },
        d: 'F2axeahCaZfbUYUcKefc3j',
        l: 'ent-logo-url',
        v: '74xeXSEac5QTWzQmh84JqzjuXc8yvXLzWKeiqyUnYokx',
      },
      sa: {
        d: 'BDSmVkzxRYGE4HKyMKxd1H',
        v: '6yUatReYWNSUfEtC2ABgRXmmLaxCyQqsjLwv2BomxsxD',
        e: '52.38.32.107:80/agency/msg',
      },
      t: 'there',
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

// @flow

export const SCAN_STATUS = {
  SCANNING: 'scanning...',
  SUCCESS: 'Success!',
  FAIL: 'Failed to scan QR code',
}

export type QrCode = {
  id: string,
  s: {
    n: string,
    dp: {
      d: string,
      k: string,
      s: string,
    },
    d: string,
    l: string,
    v: string,
  },
  sa: {
    d: string,
    v: string,
    e: string,
  },
  t: string,
}

type ValuesType = <V>(v: V) => V

type QR_SCAN_STATUS =
  | typeof SCAN_STATUS.SCANNING
  | typeof SCAN_STATUS.FAIL
  | typeof SCAN_STATUS.SUCCESS

export type QrScannerState = {
  scanning: boolean,
  scanStatus: QR_SCAN_STATUS,
}

export type QrScannerProps = {
  onRead: QrCode => void,
  onClose: any => void,
}

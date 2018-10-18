// @flow
import type { InvitationPayload } from '../../invitation/type-invitation'

export const SCAN_STATUS = {
  SCANNING: 'scanning...',
  SUCCESS: 'Success!',
  FAIL: 'Failed to scan QR code',
  DOWNLOADING_INVITATION: 'Downloading invitation...',
  NO_INVITATION_DATA: 'No invitation found',
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
  | typeof SCAN_STATUS.DOWNLOADING_INVITATION
  | typeof SCAN_STATUS.NO_INVITATION_DATA

export type QrScannerState = {
  scanning: boolean,
  scanStatus: QR_SCAN_STATUS,
  cameraActive?: boolean,
}

export type QrScannerProps = {
  onRead: QrCode => void,
  onClose: () => void,
  onEnvironmentSwitchUrl: EnvironmentSwitchUrlQrCode => void,
  onInvitationUrl: InvitationPayload => void,
}

export type CameraMarkerProps = {
  status: QR_SCAN_STATUS,
  onClose: () => void,
}

export const TOP_LEFT = 'topLeft'
export const TOP_RIGHT = 'topRight'
export const BOTTOM_LEFT = 'bottomLeft'
export const BOTTOM_RIGHT = 'bottomRight'

export type CornerBoxProps = {
  status: QR_SCAN_STATUS,
  position:
    | typeof TOP_LEFT
    | typeof TOP_RIGHT
    | typeof BOTTOM_LEFT
    | typeof BOTTOM_RIGHT,
}

export type EnvironmentSwitchUrlQrCode = {
  url: string,
  name: string,
}

export type InvitationUrlQrCode = {
  url: string,
}

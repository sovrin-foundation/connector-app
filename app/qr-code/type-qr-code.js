// @flow
import type {
  InvitationReceivedActionData,
  InvitationReceivedAction,
} from '../invitation/type-invitation'
import type { ReactNavigation } from '../common/type-common'

export type QRCodeScannerScreenState = {
  isCameraAuthorized: boolean,
}

export type QRCodeScannerScreenProps = {
  currentScreen: string,
  invitationReceived: (
    data: InvitationReceivedActionData
  ) => InvitationReceivedAction,
} & ReactNavigation

export const MESSAGE_NO_CAMERA_PERMISSION = 'No Camera permission'

export const MESSAGE_ALLOW_CAMERA_PERMISSION =
  'Please allow connect me to access camera from camera settings'

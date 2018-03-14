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
  changeEnvironmentUrl: (url: string) => void,
} & ReactNavigation

export const MESSAGE_NO_CAMERA_PERMISSION = 'No Camera permission'

export const MESSAGE_ALLOW_CAMERA_PERMISSION =
  'Please allow connect me to access camera from camera settings'

export const MESSAGE_RESET_CONNECT_ME = 'Reset Connect.Me?'

export const MESSAGE_RESET_DETAILS = (name: string) =>
  `You are about to switch to ${name} which is a test network. This will reset Connect.Me and you will PERMANENTLY lose all of your claims and connections. Proceed?`

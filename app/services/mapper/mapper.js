// @flow
import { bubbleSize } from '../../common/styles'
import type { Connection, InvitationPayload } from './type-mapper'

export const stringToLower = (str: String) => str.toLowerCase()

export const connectionMapper = ({
  logoUrl,
  size = bubbleSize.XL,
  name,
  ...otherArgs
}: Connection) => ({
  logoUrl,
  size,
  name: name ? name.split(' ')[0] : 'evernym',
  ...otherArgs,
})

export const invitationPayloadMapper = (payload: InvitationPayload) => ({
  title: payload.offerMsgTitle || payload.authNotifMsgTitle || payload.title,
  message: payload.offerMsgText || payload.authNotifMsgText || payload.message,
  statusCode: payload.statusCode,
  senderLogoUrl: payload.senderLogoUrl || null,
  remoteConnectionId: payload.remotePairwiseDID,
  payload: payload,
})

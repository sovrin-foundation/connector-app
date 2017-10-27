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
  connReqId: payload.connReqId,
  title: `Hi, ${payload.targetName}`,
  message: `${payload.senderName} wants to connect with you.`,
  senderName: payload.senderName,
  senderLogoUrl: payload.senderLogoUrl || null,
  senderDID: payload.senderDID,
  senderEndpoint: payload.senderEndpoint,
  senderDIDVerKey: payload.senderDIDVerKey,
  targetName: payload.targetName,
})

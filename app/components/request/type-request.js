// @flow
export type noop = () => any

export type RequestDetailTextPropsText = {
  title: string,
  message: string,
  testID: string,
}

export type RequestDetailActionProps = {
  onTitlePress?: noop,
}

export type RequestDetailTextProps = RequestDetailTextPropsText &
  RequestDetailActionProps

export type RequestDetailAvatarProps = {
  senderLogoUrl?: ?string,
}

export type RequestDetailProps = RequestDetailTextProps &
  RequestDetailAvatarProps

export const ResponseType = {
  accepted: 'accepted',
  rejected: 'rejected',
  none: 'none',
}

// TODO: Need to move this to one place for each store such as invitation, qr connection, & authentication request
export type ResponseTypes = $Keys<typeof ResponseType>

export type RequestProps = RequestDetailProps & {
  onAction: (response: ResponseTypes) => void,
  showErrorAlerts: boolean,
}

export type RequestState = {
  tapCount: number,
}

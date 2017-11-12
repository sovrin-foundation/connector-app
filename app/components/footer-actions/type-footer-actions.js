// @flow
export type FooterActionsProps = {
  logoUrl: ?string,
  onAccept: () => void,
  onDecline: () => void,
  denyTitle?: string,
  acceptTitle?: string,
  testID: string,
}

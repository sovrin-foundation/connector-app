// @flow
export type FooterActionsProps = {
  disableAccept?: boolean,
  logoUrl?: ?string,
  onAccept?: () => void,
  onDecline?: () => void,
  denyTitle?: string,
  acceptTitle?: string,
  testID: string,
  hidePrimary?: boolean,
}

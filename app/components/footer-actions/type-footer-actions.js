import { ReactNavigation } from '../../common/type-common'

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
  activeConnectionThemePrimary?: string,
  useColorPicker?: boolean,
} & ReactNavigation

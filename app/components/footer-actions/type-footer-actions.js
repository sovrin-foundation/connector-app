// @flow
import type { ReactNavigation } from '../../common/type-common'

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
  accessible: boolean,
  accessibilityLabel: string,
  disableDeny?: boolean,
} & ReactNavigation

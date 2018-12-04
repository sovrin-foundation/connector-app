// @flow

import type { ImageSource } from '../../common/type-common'
import type { ClaimMap } from '../../claim/type-claim'

export type Item = {
  label: string,
  data?: string,
  claimUuid?: string,
  logoUrl?: string,
  key?: string,
}

export type CustomListProps = {
  items: Array<Item>,
  type?: string,
  claimMap?: ?ClaimMap,
  avatarSource?: ?ImageSource,
}

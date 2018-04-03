// @flow

import type { ClaimMap } from '../../claim/type-claim'

export type Item = {
  label: string,
  data?: string,
  claimUuid?: string,
  logoUrl?: string,
}

export type CustomListProps = {
  items: Array<Item>,
  type?: string,
  claimMap?: ?ClaimMap,
}

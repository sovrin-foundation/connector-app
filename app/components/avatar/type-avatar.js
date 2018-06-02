// @flow
import type { GenericObject } from '../../common/type-common'

export type AvatarProps = {
  // TODO:KS Add specific props that are needed by Avatar component
} & GenericObject

export type BadgeAvatarProps = {
  onPress: (event: any) => void,
  count: number | string,
}

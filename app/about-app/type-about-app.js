// @flow
import type { CustomError, ReactNavigation } from '../common/type-common'

export type AboutAppProps = {} & ReactNavigation

export type AboutAppListItemProps = {
  onPress: () => void,
  titleValue: string,
}

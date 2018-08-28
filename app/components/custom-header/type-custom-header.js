// @flow
import type { GenericObject, ReactChildren } from '../../common/type-common'
import * as React from 'react'

// backgroundColor is required as this handles statusbar color in the given screen
export type CustomHeaderProps = {
  backgroundColor: string,
  children?: React.Node,
  centerComponent?: ReactChildren,
  leftComponent?: ReactChildren,
  rightComponent?: ReactChildren,
  outerContainerStyles?: GenericObject,
  flatHeader?: boolean,
  largeHeader?: boolean,
}

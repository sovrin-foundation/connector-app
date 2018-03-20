// @flow
import type { Element } from 'react'
import type { GenericObject } from '../../common/type-common'

export type ClaimProofHeaderProps = {
  children?: Element<*> | Array<Element<*>>,
  message?: string,
  title?: string,
  logoUrl: ?string,
  testID: string,
  containerStyle?: GenericObject,
  textContainerStyle?: Array<GenericObject | number>,
  messageStyle?: Array<GenericObject | number>,
  titleStyle?: GenericObject,
  useColorPicker?: boolean,
}

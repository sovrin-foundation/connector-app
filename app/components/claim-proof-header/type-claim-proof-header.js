// @flow
import type { Element } from 'react'
import type { GenericObject } from '../../common/type-common'

export type ClaimProofHeaderProps = {
  children?: Element<*>,
  message?: string,
  title?: string,
  logoUrl: ?string,
  testID: string,
  containerStyle?: GenericObject,
  textContainerStyle?: Array<GenericObject>,
  messageStyle?: Array<GenericObject>,
  titleStyle?: GenericObject,
}

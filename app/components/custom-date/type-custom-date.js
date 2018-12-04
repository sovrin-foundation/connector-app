// @flow
import type { GenericObject, ReactChildren } from '../../common/type-common'

export type CustomTextProps = {
  h4: string,
  h5: string,
  h6: string,
  h7: string,
  bold: string,
  thick: string,
  semiBold: string,
  demiBold: string,
  center: string,
  bg: string,
  primary: string,
  secondary: string,
  tertiary: string,
  quaternary: string,
  style: Array<GenericObject>,
  testID: string,
  onPress: () => void,
  onLongPress: () => void,
  transparentBg: string,
  uppercase: string,
  heavy: string,
}

export type CustomDateProps = {
  format?: string,
  children: string,
}

// @flow

export type KeyboardProps = {
  maxLength: number,
  onPress: (text: string, animate: boolean) => void,
  color: string,
  maxValue: string,
  afterDecimalSeparatorMaxLength?: number,
  customKeyboard?: boolean,
  showDecimal?: boolean,
}

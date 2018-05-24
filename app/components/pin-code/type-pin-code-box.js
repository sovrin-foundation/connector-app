// @flow
export type PinCodeDigitProps = {
  entered: boolean,
  testID?: ?string,
  accessible?: boolean,
  accessibilityLabel?: string,
  onPress: () => void,
}

export type PinCodeBoxProps = {
  onPinComplete: (pin: string) => void,
}

export type PinCodeBoxState = {
  pin: string,
}

export type TextInputRef = {
  clear: () => void,
  isFocused: () => boolean,
  focus: () => void,
  blur: () => void,
}

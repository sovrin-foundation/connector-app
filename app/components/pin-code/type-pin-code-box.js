// @flow
export type PinCodeDigitProps = {
  entered: boolean,
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
}

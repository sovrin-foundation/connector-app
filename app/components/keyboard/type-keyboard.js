// @flow

export type KeyboardProps = {
  maxLength: number,
  onPress: (text: string, animate: boolean) => void,
  color: string,
}

export type KeyboardState = {
  text: string,
}

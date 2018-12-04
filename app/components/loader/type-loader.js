// @flow

export const DARK = 'dark'
export const LIGHT = 'light'

export type ColorType = 'dark' | 'light'

export type LoadingIndicatorProps = {
  type: ColorType,
  size: number,
}

export type LoaderState = {
  message: string,
  show: boolean,
}

export type LoaderProps = {
  type: ColorType,
  message?: string,
  interval: any,
  timeout: number,
  delay: number,
  showMessage: boolean,
  size: number,
}

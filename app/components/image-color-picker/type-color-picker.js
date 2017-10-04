// @flow
type ColorType = {
  r: number,
  g: number,
  b: number,
}

export type ImagePickerProps = {
  imageType: string,
  imageUrl: string,
  updateActiveConnectionTheme: (color: ColorType) => void,
}

export type ImagePickerStates = {
  imageBlob: string,
  imageColor: ColorType,
}

export type ConnectionThemeProps = {
  shade: string,
  activeConnectionColor: ColorType,
  children: any, //TODO:PS: import exact react children types
  backgroundColor: string,
  style: any,
}

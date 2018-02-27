// @flow

export type ConnectionTheme = {
  primary: string,
  secondary: string,
}

export type ImagePickerProps = {
  imageType: string,
  imageUrl: string,
  updateConnectionTheme: (
    logoUrl: string,
    color: string,
    secondaryColor: string
  ) => void,
}

export type ImagePickerStates = {
  imageBlob: string,
}

export type ConnectionThemeProps = {
  logoUrl: string,
  secondary: string,
  connectionTheme: ConnectionTheme,
  children: any, //TODO:PS: import exact react children types
  backgroundColor: string,
  style: any,
  disabled?: boolean,
}

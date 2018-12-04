// @flow

declare module 'react-native-image-resizer' {
  declare type ResizedImageInfo = {
    path: string,
    uri: string,
    size?: number,
    name?: string,
  }

  declare type ImageResizer = {
    createResizedImage: (
      uri: string,
      width: number,
      height: number,
      format: 'PNG' | 'JPEG' | 'WEBP',
      quality: number,
      rotation?: number,
      outputPath?: string
    ) => Promise<ResizedImageInfo>,
  }

  declare export default ImageResizer
}

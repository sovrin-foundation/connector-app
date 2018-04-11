// @flow
declare module 'react-native-touch-id' {
  declare interface TouchIDError {
    name: string;
    message: string;
    details: any;
  }
  declare module.exports: {
    authenticate(reason: string): Promise<boolean | TouchIDError>,
    isSupported(): Promise<boolean | TouchIDError>,
  }
}

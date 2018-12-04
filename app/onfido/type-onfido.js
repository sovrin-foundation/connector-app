// @flow

import type { CustomError, ReactNavigation } from '../common/type-common'

export const START_ONFIDO = 'START_ONFIDO'
export const LAUNCH_ONFIDO_SDK = 'LAUNCH_ONFIDO_SDK'

export type OnfidoState = {
  //title: string,
  first_name: string,
  last_name: string,
  //email: string,
  //gender: string,
  dob: string,
  //state: string,
  //country: string,
  //'addresses[][building_number]': string,
  //'addresses[][street]': string,
  //'addresses[][town]': string,
  //'addresses[][postcode]': string,
  //'addresses[][state]': string,
  //'addresses[][country]': string,
}

// export type OnfidoState = {
//   onfidoName: string,
//   applicant: OnfidoApplicant,
// }

export type OnfidoProps = {
  contentTitle: string,
  contentSubtitle: string,
} & ReactNavigation

export type OnfidoStore = {
  //applicant: OnfidoApplicant,
}

export type OnfidoStartAction = {
  type: typeof START_ONFIDO,
  status: $Keys<typeof ONFIDO_STORE_STATUS>,
  error: CustomError,
}

export type LaunchOnfidoSDKAction = {
  type: typeof LAUNCH_ONFIDO_SDK,
  status: $Keys<typeof ONFIDO_STORE_STATUS>,
}

export type OnfidoStoreAction = OnfidoStartAction

export const ONFIDO_STORE_STATUS = {
  IDLE: 'IDLE',
}

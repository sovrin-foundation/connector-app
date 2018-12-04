// @flow

import type { Element } from 'react'
import type { NavigationScreenProp } from 'react-navigation'

export type CustomError = {
  code: string,
  message: string,
}

export const INITIAL_TEST_ACTION: 'INITIAL_TEST_ACTION' = 'INITIAL_TEST_ACTION'

export type InitialTestAction = {
  type: typeof INITIAL_TEST_ACTION,
}

export const initialTestAction = () => ({
  type: INITIAL_TEST_ACTION,
})

export type NavigationParams = {
  [string]: any,
}
export type NavigationRoute = NavigationLeafRoute
export type NavigationState = {
  index: number,
  routes: Array<NavigationRoute>,
}

export type NavigationLeafRoute = {|
  key: string,
  routeName: string,
  path?: string,
  params?: NavigationParams,
|}

export type ReactNavigation = NavigationScreenProp

export type GenericObject = {
  [string]: any,
}

export type GenericStringObject = {
  [string]: string,
}

export type MessageAnnotation = {
  name: string,
  version: string,
}

export type TopicAnnotation = {
  tid: number,
  mid: number,
}

export type ReactChildren = Element<*>

export const RESET: 'RESET' = 'RESET'
export const REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS: 'REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS' =
  'REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS'

export type ResetAction = {
  type: typeof RESET,
}

export type ImageSource = {
  uri: string,
}

export type NotificationPayload = {
  forDID: string,
  uid: string,
  type: string,
  remotePairwiseDID: string,
  senderLogoUrl?: ?string,
}

export type ImmutableGenericStringObject = {
  +[string]: string,
}

export const STORE_STATUS = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
}

export type StoreError = { +error: ?CustomError }
export type StoreStatus = { +status: $Keys<typeof STORE_STATUS> }

export type StatusBarStyle = 'default' | 'light-content' | 'dark-content'

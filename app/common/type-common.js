// @flow

import type { Element } from 'react'

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

export type ReactNavigation = {
  navigation: {
    navigate: (route: string, params?: any) => void,
    state?: {
      // TODO:KS This has to accept a Generic and every where we are using
      // react navigation params, we have to pass a generic for type safety
      params: NavigationParams,
    },
    goBack: (route?: ?string) => void,
    // TODO: Had to use any here because we don't know type of beforehand
    // need to move react navigation library to latest version
    // and use their type, also need to use Generics here
    dispatch: any => void,
    setParams: (params?: any) => void,
    isFocused: boolean,
  },
}

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

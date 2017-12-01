// @flow

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
      params: NavigationParams,
    },
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

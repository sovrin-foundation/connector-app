// @flow

export const DEEP_LINK_ERROR = 'DEEP_LINK_ERROR'
export const DEEP_LINK_DATA = 'DEEP_LINK_DATA'
export const DEEP_LINK_EMPTY = 'DEEP_LINK_EMPTY'

export type DeepLinkDataAction = {
  type: typeof DEEP_LINK_DATA,
  data: string,
}

export type DeepLinkEmptyAction = {
  type: typeof DEEP_LINK_EMPTY,
}

export type DeepLinkErrorAction = {
  type: typeof DEEP_LINK_ERROR,
  error: ?any,
}

export type DeepLinkStore = {
  token: ?string,
  isLoading: boolean,
  error: ?any,
}

export type DeepLinkAction =
  | DeepLinkDataAction
  | DeepLinkEmptyAction
  | DeepLinkErrorAction

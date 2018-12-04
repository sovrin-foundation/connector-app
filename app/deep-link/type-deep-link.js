// @flow
import type { CustomError, ResetAction } from '../common/type-common'

export const DEEP_LINK_ERROR = 'DEEP_LINK_ERROR'
export const DEEP_LINK_DATA = 'DEEP_LINK_DATA'
export const DEEP_LINK_EMPTY = 'DEEP_LINK_EMPTY'
export const DEEP_LINK_PROCESSED = 'DEEP_LINK_PROCESSED'

export const DEEP_LINK_STATUS = {
  NONE: 'NONE',
  PROCESSED: 'PROCESSED',
}

export type DeepLinkDataAction = {
  type: typeof DEEP_LINK_DATA,
  data: string,
}

export type DeepLinkEmptyAction = {
  type: typeof DEEP_LINK_EMPTY,
}

export type DeepLinkProcessedAction = {
  type: typeof DEEP_LINK_PROCESSED,
  data: string,
}

export type DeepLinkErrorAction = {
  type: typeof DEEP_LINK_ERROR,
  error: ?any,
}

export type Token = {
  +status: string,
  +token: string,
  +error: ?CustomError,
}

export type DeepLinkStore = {
  tokens:
    | {
        +[string]: Token,
      }
    | {},
  isLoading: boolean,
  error: ?string,
}

export type DeepLinkAction =
  | DeepLinkDataAction
  | DeepLinkEmptyAction
  | DeepLinkErrorAction
  | ResetAction

export type DeepLinkBundle = {
  error: ?string,
  params: ?{
    ['+clicked_branch_link']: boolean,
    t: string,
  },
}

export type DeepLinkProps = {
  deepLinkData: (token: string) => void,
  deepLinkEmpty: () => void,
  deepLinkError: string => void,
  tokens: {
    [string]: Token,
  },
}

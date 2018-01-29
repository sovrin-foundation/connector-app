// @flow
import type { CustomError, InitialTestAction } from '../../common/type-common'

export type UserOneTimeInfo = {
  oneTimeAgencyDid: string,
  oneTimeAgencyVerificationKey: string,
  myOneTimeDid: string,
  myOneTimeVerificationKey: string,
  myOneTimeAgentDid: string,
  myOneTimeAgentVerificationKey: string,
}

export type UserStore = {
  isFetching: boolean,
  error: ?CustomError,
  userOneTimeInfo: ?UserOneTimeInfo,
}

export const CONNECT_REGISTER_CREATE_AGENT_DONE =
  'CONNECT_REGISTER_CREATE_AGENT_DONE'

export type ConnectRegisterCreateAgentDoneAction = {
  type: typeof CONNECT_REGISTER_CREATE_AGENT_DONE,
  userOneTimeInfo: UserOneTimeInfo,
}

export const HYDRATE_USER_STORE = 'HYDRATE_USER_STORE'

export type HydrateUserStoreAction = {
  type: typeof HYDRATE_USER_STORE,
  userOneTimeInfo: UserOneTimeInfo,
}

export const SAVE_USER_ONE_TIME_INFO_FAIL = 'SAVE_USER_ONE_TIME_INFO_FAIL'

export type SaveUserOneTimeInfoFailAction = {
  type: typeof SAVE_USER_ONE_TIME_INFO_FAIL,
  error: CustomError,
}

export const PARSE_USER_ONE_TIME_INFO_FAIL = 'PARSE_USER_ONE_TIME_INFO_FAIL'

export type ParseUserOneTimeInfoFailAction = {
  type: typeof PARSE_USER_ONE_TIME_INFO_FAIL,
  error: CustomError,
}

export type UserStoreAction =
  | ConnectRegisterCreateAgentDoneAction
  | HydrateUserStoreAction
  | SaveUserOneTimeInfoFailAction
  | ParseUserOneTimeInfoFailAction
  | InitialTestAction

export const STORAGE_KEY_USER_ONE_TIME_INFO = 'STORAGE_KEY_USER_ONE_TIME_INFO'

export const ERROR_SAVE_USER_INFO_FAIL = {
  message: 'Failed to store user one time info: ',
  code: 'US-001',
}

export const ERROR_PARSE_USER_INFO_FAIL = {
  message: 'Failed to parse user info: ',
  code: 'US-002',
}

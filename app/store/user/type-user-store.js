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
  avatarName: ?string,
}

export type ChangeEnvironment = {
  agencyUrl: string,
  poolConfig: string,
  agencyDID: string,
  agencyVerificationKey: string,
}

export const CONNECT_REGISTER_CREATE_AGENT_DONE =
  'CONNECT_REGISTER_CREATE_AGENT_DONE'

export type ConnectRegisterCreateAgentDoneAction = {
  type: typeof CONNECT_REGISTER_CREATE_AGENT_DONE,
  userOneTimeInfo: UserOneTimeInfo,
}

export const HYDRATE_USER_STORE = 'HYDRATE_USER_STORE'

export type HydrateUserStoreData = {
  userOneTimeInfo?: ?UserOneTimeInfo,
  avatarName?: ?string,
}

export type HydrateUserStoreAction = {
  type: typeof HYDRATE_USER_STORE,
  data: HydrateUserStoreData,
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

export const SAVE_USER_SELECTED_AVATAR = 'SAVE_USER_SELECTED_AVATAR'

export type SaveUserSelectedAvatarAction = {
  type: typeof SAVE_USER_SELECTED_AVATAR,
  imagePath: string,
}

export const SAVE_USER_SELECTED_AVATAR_SUCCESS =
  'SAVE_USER_SELECTED_AVATAR_SUCCESS'
export type SaveUserSelectedAvatarSuccessAction = {
  type: typeof SAVE_USER_SELECTED_AVATAR_SUCCESS,
  avatarName: string,
}

export const SAVE_USER_SELECTED_AVATAR_FAIL = 'SAVE_USER_SELECTED_AVATAR_FAIL'
export type SaveUserSelectedAvatarFailAction = {
  type: typeof SAVE_USER_SELECTED_AVATAR_FAIL,
  error: CustomError,
}

export const SELECT_USER_AVATAR = 'SELECT_USER_AVATAR'
export type SelectUserAvatarAction = {
  type: typeof SELECT_USER_AVATAR,
}

export const SELECT_USER_AVATAR_FAIL = 'SELECT_USER_AVATAR_FAIL'
export type SelectUserAvatarFailAction = {
  type: typeof SELECT_USER_AVATAR_FAIL,
  error: CustomError,
}

export const USER_AVATAR_IMAGE_NAME = 'user-avatar'

export type UserStoreAction =
  | ConnectRegisterCreateAgentDoneAction
  | HydrateUserStoreAction
  | SaveUserOneTimeInfoFailAction
  | ParseUserOneTimeInfoFailAction
  | SaveUserSelectedAvatarAction
  | SaveUserSelectedAvatarSuccessAction
  | SaveUserSelectedAvatarFailAction
  | SelectUserAvatarAction
  | SelectUserAvatarFailAction
  | InitialTestAction

export const STORAGE_KEY_USER_ONE_TIME_INFO = 'STORAGE_KEY_USER_ONE_TIME_INFO'
export const STORAGE_KEY_USER_AVATAR_NAME = 'STORAGE_KEY_USER_AVATAR_NAME'

export const ERROR_SAVE_USER_INFO_FAIL = {
  message: 'Failed to store user one time info: ',
  code: 'US-001',
}

export const ERROR_PARSE_USER_INFO_FAIL = {
  message: 'Failed to parse user info: ',
  code: 'US-002',
}

export const ERROR_SAVE_USER_SELECTED_IMAGE = (message: string) => ({
  message: `Failed to store user avatar: ${message}`,
  code: 'US-003',
})

export const ERROR_HYDRATE_USER_SELECTED_IMAGE = (message: string) => ({
  message: `Failed to get user avatar: ${message}`,
  code: 'US-004',
})

export const ERROR_SELECT_USER_AVATAR = (message: string) => ({
  message: `Failed to select user avatar: ${message}`,
  code: 'US-005',
})

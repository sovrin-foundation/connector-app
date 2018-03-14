// @flow
import type { CustomError } from '../common/type-common'

export const SERVER_ENVIRONMENT = {
  DEMO: 'DEMO',
  SANDBOX: 'SANDBOX',
  STAGING: 'STAGING',
  DEVELOPMENT: 'DEVELOPMENT',
}

export type ServerEnvironment = $Keys<typeof SERVER_ENVIRONMENT>

export const APP_INSTALLED = 'APP_INSTALLED'
export type AppInstalledSuccessAction = {
  type: typeof APP_INSTALLED,
}

export const HYDRATED = 'HYDRATED'
export type HydratedAction = {
  type: typeof HYDRATED,
}

export const ALREADY_INSTALLED_RESULT = 'ALREADY_INSTALLED_RESULT'
export type AlreadyInstalledAction = {
  type: typeof ALREADY_INSTALLED_RESULT,
  isAlreadyInstalled: boolean,
}

export const SERVER_ENVIRONMENT_CHANGED = 'SERVER_ENVIRONMENT_CHANGED'
export type ServerEnvironmentChangedAction = {
  type: typeof SERVER_ENVIRONMENT_CHANGED,
  serverEnvironment: ServerEnvironment,
}

export const SERVER_ENVIRONMENT_CHANGED_DEMO = 'SERVER_ENVIRONMENT_CHANGED_DEMO'
export type ServerEnvironmentChangedDemoAction = {
  type: typeof SERVER_ENVIRONMENT_CHANGED_DEMO,
}

export const SWITCH_ENVIRONMENT = 'SWITCH_ENVIRONMENT'
export type ChangeEnvironment = {
  agencyUrl: string,
  poolConfig: string,
  agencyDID: string,
  agencyVerificationKey: string,
}

export type SwitchEnvironmentAction = {
  type: typeof SWITCH_ENVIRONMENT,
} & ChangeEnvironment

export const SERVER_ENVIRONMENT_CHANGED_SANDBOX =
  'SERVER_ENVIRONMENT_CHANGED_SANDBOX'
export type ServerEnvironmentChangedSandboxAction = {
  type: typeof SERVER_ENVIRONMENT_CHANGED_SANDBOX,
}

export const SWITCH_ERROR_ALERTS = 'SWITCH_ERROR_ALERTS'
export type SwitchErrorAlertsAction = {
  type: typeof SWITCH_ERROR_ALERTS,
}

export const TOGGLE_ERROR_ALERTS = 'TOGGLE_ERROR_ALERTS'
export type ToggleErrorAlertsAction = {
  type: typeof TOGGLE_ERROR_ALERTS,
  isShowErrorAlert: boolean,
}

export const SAVE_SWITCH_ENVIRONMENT_DETAIL_FAIL =
  'SAVE_SWITCH_ENVIRONMENT_DETAIL_FAIL'
export type SaveSwitchEnvironmentDetailFailAction = {
  type: typeof SAVE_SWITCH_ENVIRONMENT_DETAIL_FAIL,
  error: CustomError,
}

export const HYDRATE_SWITCH_ENVIRONMENT_DETAIL_FAIL =
  'HYDRATE_SWITCH_ENVIRONMENT_DETAIL_FAIL'

export type HydrateSwitchEnvironmentDetailFailAction = {
  type: typeof HYDRATE_SWITCH_ENVIRONMENT_DETAIL_FAIL,
  error: CustomError,
}

export const CHANGE_ENVIRONMENT_VIA_URL = 'CHANGE_ENVIRONMENT_VIA_URL'
export type ChangeEnvironmentUrlAction = {
  type: typeof CHANGE_ENVIRONMENT_VIA_URL,
  url: string,
}

export type ConfigAction =
  | HydratedAction
  | AppInstalledSuccessAction
  | AlreadyInstalledAction
  | ServerEnvironmentChangedAction
  | ServerEnvironmentChangedDemoAction
  | ServerEnvironmentChangedSandboxAction
  | SwitchErrorAlertsAction
  | ToggleErrorAlertsAction
  | SwitchEnvironmentAction
  | SaveSwitchEnvironmentDetailFailAction
  | HydrateSwitchEnvironmentDetailFailAction
  | ChangeEnvironmentUrlAction

export type ConfigStore = {
  isAlreadyInstalled: boolean,
  isHydrated: boolean,
  showErrorAlerts: boolean,
  agencyUrl: string,
  agencyDID: string,
  agencyVerificationKey: string,
  poolConfig: string,
}

export const STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL =
  'STORAGE_KEY_SWITCHED_ENVIRONMENT_DETAIL'

export const ERROR_SAVE_SWITCH_ENVIRONMENT = {
  code: 'CS-000',
  message: 'Failed to store switched environment details: ',
}

export const ERROR_HYDRATE_SWITCH_ENVIRONMENT = {
  code: 'CS-001',
  message: 'Failed to hydrate switched environment details: ',
}

export const schemaDownloadedEnvironmentDetails = {
  type: 'object',
  properties: {
    agencyUrl: { type: 'string' },
    agencyDID: { type: 'string' },
    agencyVerificationKey: { type: 'string' },
    poolConfig: { type: 'string' },
  },
  required: ['agencyDID', 'agencyUrl', 'agencyVerificationKey', 'poolConfig'],
}

export const MESSAGE_FAIL_ENVIRONMENT_SWITCH_TITLE =
  'Failed to switch environment'

export const MESSAGE_FAIL_ENVIRONMENT_SWITCH_INVALID_DATA = (url: string) =>
  `Data returned by ${url} is not valid as per our requirements.`

export const MESSAGE_FAIL_ENVIRONMENT_SWITCH_ERROR = (message: string) =>
  `Failed to switch environment due to following error. ${message}`

export const MESSAGE_SUCCESS_ENVIRONMENT_SWITCH_TITLE = 'Success'

export const MESSAGE_SUCCESS_ENVIRONMENT_SWITCH_DESCRIPTION =
  'Environment switched successfully.'

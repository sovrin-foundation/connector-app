// @flow
// for overall app message string, it can be error, success, warning etc.

export const TOUCH_ID_MESSAGE = 'Please confirm with TouchID'
export const TOUCH_ID_NOT_AVAILABLE = 'Touch ID is not supported on this device'

export const DEVICE_ENROLLMENT_ERROR = [
  'Enrollment Error',
  'Identifier or Seed or Push-notification token not present!',
]

export const PUSH_NOTIFICATION_PERMISSION_ERROR = [
  'Permission Error',
  'Push Notification permission needed! Please enable it from Settings.',
]

export const DUPLICATE_CONNECTION_ERROR = [
  'Attention!',
  'Duplicate Connection invitation!',
]

export const UNLOCKING_APP_WAIT_MESSAGE = 'Loading please wait...'

export const ENTER_PASS_CODE_MESSAGE = 'Enter pass code'

export const ENTER_YOUR_PASS_CODE_MESSAGE = 'Enter your pass code'

export const FIRST_BACKUP_TITLE = 'Setup Data Recovery Now!'

export const FIRST_BACKUP_SUBTEXT = '2 easy steps, takes 3 minutes.'

export const SUBSEQUENT_BACKUP_TITLE =
  'You have new data that is not backed up.'

export const SUBSEQUENT_BACKUP_SUBTEXT =
  "Create another backup so you don't lose anything."

export const PASSPHRASE_GENERATION_ERROR =
  'Uh oh... Looks like something went wrong.'

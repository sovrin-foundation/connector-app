// @flow

import { RestoreStatus, ERROR_RESTORE_FILE } from '../type-restore'
import { getStore } from '../../../__mocks__/static-data'
import restoreReducer, {
  saveFileToAppDirectory,
  submitPassphrase,
  restoreStatus,
  errorRestore,
} from '../restore-store'

describe('store: backup-store: ', () => {
  let initialState
  beforeEach(() => {
    initialState = {
      status: RestoreStatus.none,
      error: null,
      passphrase: '',
      restoreFile: {
        fileName: '',
        fileSize: 0,
        type: '',
        uri: '',
      },
    }
  })
  const { restoreFile } = getStore().getState().restore
  const dataStore = getStore().getState()
  const passphrase = 'one two three'
  const salt = 'salty spoon'
  it('action: SAVE_FILE_TO_APP_DIRECTORY', () => {
    expect(
      restoreReducer(initialState, saveFileToAppDirectory(restoreFile))
    ).toMatchSnapshot()
  })
  it('action: RESTORE_SUBMIT_PASSPHRASE', () => {
    expect(
      restoreReducer(initialState, submitPassphrase(passphrase))
    ).toMatchSnapshot()
  })
  it('action: RESTORE_STATUS', () => {
    expect(
      restoreReducer(initialState, restoreStatus(RestoreStatus.success))
    ).toMatchSnapshot()
  })
  it('action: ERROR_RESTORE', () => {
    expect(
      restoreReducer(initialState, errorRestore(ERROR_RESTORE_FILE))
    ).toMatchSnapshot()
  })
})

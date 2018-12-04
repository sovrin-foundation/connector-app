// @flow
import type { CustomError } from '../../common/type-common'

export type BackupRestorePassphraseProps = {
  testID: string,
  filename?: string,
  placeholder: string,
  errorState?: boolean,
  onSubmit: () => any,
}

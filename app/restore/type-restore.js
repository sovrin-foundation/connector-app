// @flow

import type { ReactNavigation } from '../common/type-common'

export type RestoreProps = {
  updateStatusBarTheme: string => void,
} & ReactNavigation

export type RestorePassphraseProps = {
  navigation: {
    state: {
      params: {
        filename?: string,
      },
    },
  },
}

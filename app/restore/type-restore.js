// @flow

import type { ReactNavigation } from '../common/type-common'

export type RestoreProps = {
  updateStatusBarTheme: string => void,
} & ReactNavigation

export type RestorePassPhraseProps = {
  navigation: {
    state: {
      params: {
        filename?: string,
      },
    },
  },
}

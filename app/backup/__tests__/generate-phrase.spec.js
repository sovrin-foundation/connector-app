// @flow

import React from 'react'
import renderer from 'react-test-renderer'
import { GenerateRecoveryPhrase } from '../generate-phrase'
import { getNavigation } from '../../../__mocks__/static-data'
import { settingsRoute } from '../../common'
import { BACKUP_STORE_STATUS } from '../type-backup'

describe('<GenerateRecoveryPhrase />', () => {
  const recoveryPassphrase = 'hello some passphrase'
  const navigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    state: {
      params: {
        recoveryPassphrase,
        initialRoute: settingsRoute,
      },
    },
  }

  it('should match snapshot', () => {
    const tree = renderer
      .create(
        <GenerateRecoveryPhrase
          recoveryPassphrase={{
            phrase: recoveryPassphrase,
            salt: 'salt',
            hash: 'hash',
          }}
          generateRecoveryPhrase={jest.fn()}
          recoveryStatus={BACKUP_STORE_STATUS.GENERATE_PHRASE_SUCCESS}
          navigation={navigation}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('should match snapshot for loading state', () => {
    const tree = renderer
      .create(
        <GenerateRecoveryPhrase
          recoveryPassphrase={{
            phrase: recoveryPassphrase,
            salt: 'salt',
            hash: 'hash',
          }}
          generateRecoveryPhrase={jest.fn()}
          recoveryStatus={BACKUP_STORE_STATUS.GENERATE_PHRASE_LOADING}
          navigation={navigation}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('should match snapshot for error state', () => {
    const tree = renderer
      .create(
        <GenerateRecoveryPhrase
          recoveryPassphrase={{
            phrase: recoveryPassphrase,
            salt: 'salt',
            hash: 'hash',
          }}
          generateRecoveryPhrase={jest.fn()}
          recoveryStatus={BACKUP_STORE_STATUS.GENERATE_PHRASE_FAILURE}
          navigation={navigation}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

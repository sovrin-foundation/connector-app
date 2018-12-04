// @flow
import deepLinkReducer, {
  deepLinkData,
  deepLinkEmpty,
  deepLinkError,
} from '../deep-link-store'
import { RESET, initialTestAction } from '../../common/type-common'

describe('Deep link store', () => {
  let initialState
  beforeEach(() => {
    initialState = deepLinkReducer(undefined, initialTestAction())
  })

  it('should correctly update store when we get deep link data', () => {
    expect(
      deepLinkReducer(initialState, deepLinkData('erg76sd'))
    ).toMatchSnapshot()
  })

  it('should update store for empty link', () => {
    expect(deepLinkReducer(initialState, deepLinkEmpty())).toMatchSnapshot()
  })

  it('should update store for error', () => {
    expect(
      deepLinkReducer(initialState, deepLinkError('error'))
    ).toMatchSnapshot()
  })

  it('should reset, if RESET action is raised', () => {
    const afterDeepLinkDataState = deepLinkReducer(
      initialState,
      deepLinkData('erg76esd')
    )
    expect(
      deepLinkReducer(afterDeepLinkDataState, { type: 'RESET' })
    ).toMatchSnapshot()
  })
})

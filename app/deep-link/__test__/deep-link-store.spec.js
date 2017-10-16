import deepLinkReducer, {
  deepLinkData,
  deepLinkEmpty,
  deepLinkError,
} from '../deep-link-store'

describe('Deep link store', () => {
  let initialState
  beforeEach(() => {
    initialState = deepLinkReducer(undefined, { type: 'INITIAL_ACTION' })
  })

  it('should correctly update store when we get deep link data', () => {
    expect(deepLinkReducer(initialState, deepLinkData('erg76sd')))
  })

  it('should update store for empty link', () => {
    expect(deepLinkReducer(initialState, deepLinkEmpty()))
  })

  it('should update store for error', () => {
    expect(deepLinkReducer(initialState, deepLinkError('error')))
  })
})

// @flow
import TouchId from '../touch-id'

describe('<TouchId />', () => {
  it('passes', () => {
    const onSuccess = jest.fn()
    const onFail = jest.fn()

    jest.useFakeTimers()

    TouchId.authenticate('test')
      .then(onSuccess)
      .catch(onFail)

    jest.runAllTimers()
    expect(onSuccess).toHaveBeenCalled()
  })
})

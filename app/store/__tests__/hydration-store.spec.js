// @flow
import { put } from 'redux-saga/effects'
import { hydrate } from '../hydration-store'
import { hydrated } from '../config-store'

describe('hydration store should update dependant store correctly', () => {
  // TODO Write this test in proper way and check for all generators and values
  it('should raise correct action with correct data', () => {
    const gen = hydrate()

    gen.next()
    gen.next()
    gen.next()
    gen.next()
    gen.next()

    expect(gen.next().value).toEqual(put(hydrated()))
  })
})

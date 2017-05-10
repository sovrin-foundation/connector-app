import { setItem, getItem, deleteItem } from '../__mocks__/secure-storage'

describe('store data to secure storage', () => {
  it('should store, retrieve and delete data', () => {
    setItem('key1', 'value1')
    getItem('key1').then(value => {
      expect(value).toEqual('value1')
    })
    deleteItem('key1')
    getItem('key1').then(value => {
      expect(value).not.toEqual('value1')
    })
  })
})

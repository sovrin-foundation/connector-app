### Mock, already globally mocked native module

Let's say we have mocked `react-native-touch-id` in setup.js. This is how we mocked it in setup.js
```js
jest.mock('react-native-touch-id', () => {
  return {
    authenticate: jest.fn(message => Promise.resolve()),
  }
})
```

If you notice here, we are always resolving module. If we run our test using `TouchId` module, then we can't test error conditions.

To mock this implementation again which rejects this promise and allow us to test error condition. We can do something as follows:

```js
import TouchId from 'react-native-touch-id'
...
it('test error condition', async () => {
  TouchId.authenticate.mockImplementation(_ => Promise.reject())
  // authenticate is internally using TouchId, we test component interface
  await component.authenticate()
  // make some assertions
})
```

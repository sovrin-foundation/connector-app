// @flow
import { connectionMapper } from '../mapper'
import { bubbleSize } from '../../../common/styles'

describe('Mapper Service', () => {
  it('connectionMapper should return proper object', () => {
    const connection = {
      identifier: '3nj819kkjywdppuje79',
      logoUrl: 'https://test-agengy.com/logo',
      size: bubbleSize.XL,
      name: 'test',
      senderDID: '123819kkjywdppuj987',
      senderEndpoint: 'https://test-endpoint.com',
      remoteConnectionId: '5iZiu2aLYrQXSdon123456',
    }
    const tree = connectionMapper(connection)
    expect(tree).toMatchSnapshot()
  })
})

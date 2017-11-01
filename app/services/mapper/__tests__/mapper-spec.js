// @flow
import { connectionMapper } from '../mapper'
import { bubbleSize } from '../../../common/styles'

describe('Mapper Service', () => {
  it('connectionMapper should return proper object', () => {
    const connection = {
      logoUrl: 'https://test-agengy.com/logo',
      size: bubbleSize.XL,
      name: 'test',
      remoteConnectionId: '5iZiu2aLYrQXSdon123456',
    }
    const tree = connectionMapper(connection)
    expect(tree).toMatchSnapshot()
  })
})

// @flow

import { connectionMapper, invitationPayloadMapper } from '../mapper'
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

  it('invitationPayloadMapper should return proper object', () => {
    const invitation = {
      connReqId: '12asd',
      targetName: 'test',
      senderName: 'test body',
      senderLogoUrl: 'http://test-agency.com/logo',
      connectionName: 'test enterprise',
      senderDID: '5iZiu2aLYrQXSdon123456',
      senderEndpoint: '192.168.1.1:80',
      senderDIDVerKey: '12345rD1ybsSR9hKWBePkRSZdnYHAv4KQ8XxcWHHasdf',
      targetName: 'test',
    }
    const tree = invitationPayloadMapper(invitation)
    expect(tree).toMatchSnapshot()
  })
})

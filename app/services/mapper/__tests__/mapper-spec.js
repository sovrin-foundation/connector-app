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
      title: 'test',
      message: 'test body',
      senderLogoUrl: 'http://test-agency.com/logo',
      connectionName: 'test enterprise',
      remotePairwiseDID: '5iZiu2aLYrQXSdon123456',
      statusCode: 'OCS',
    }
    const tree = invitationPayloadMapper(invitation)
    expect(tree).toMatchSnapshot()
  })
})

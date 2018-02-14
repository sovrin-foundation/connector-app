import Bubbles from '../../home/bubbles'
import React from 'react'
import renderer from 'react-test-renderer'

//TODO: get connections from static-data
describe('<Bubbles/>', () => {
  it('should render Bubbles', () => {
    const props = {
      connections: [
        {
          identifier: '4ej819kkjywdppuje79',
          name: 'Test Connection1',
          senderName: 'senderName',
          senderDID: 'senderDID',
          remoteConnectionId: '70075yyojywdppuje79',
          size: 100,
          logoUrl: 'https://logourl.com/logo.png',
        },
        {
          identifier: '3nj819kkjywdppuje86',
          name: 'Test Connection2',
          senderName: 'senderName',
          senderDID: 'senderDID',
          remoteConnectionId: '70075yyojywdppuje79',
          size: 100,
          logoUrl: 'https://logourl.com/logo.png',
        },
        {
          identifier: '7fj819kkjywdppuje34',
          name: 'Test Connection3',
          senderName: 'senderName',
          senderDID: 'senderDID',
          remoteConnectionId: '70075yyojywdppuje79',
          size: 100,
          logoUrl: 'https://logourl.com/logo.png',
        },
      ],
    }
    const wrapper = renderer.create(<Bubbles {...props} />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})

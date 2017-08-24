// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import Request from '../request'
import type { RequestProps, ResponseTypes } from '../type-request'

describe('<Request />', () => {
  const defaultProps: RequestProps = {
    title: 'Hi Test User',
    message: 'Enterprise A agent wants to connect with you',
    senderLogoUrl: 'https://image.url',
    onAction: jest.fn(),
  }

  it('should match snapshot', () => {
    const request = renderer
      .create(<Request {...defaultProps} onAction={defaultProps.onAction} />)
      .toJSON()
    expect(request).toMatchSnapshot()
  })

  it('bypass touch id and calls onAction with accepted', async () => {
    const onAction = jest.fn()
    const request = renderer.create(
      <Request {...defaultProps} onAction={onAction} />
    )
    const requestComponent = request.getInstance()
    // click title four times to disable touch id
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    // click on accept button
    await requestComponent.onAccept()
    // check if passed onAction is called
    expect(onAction).toBeCalled()
    expect(onAction).toHaveBeenCalledWith('accepted')
  })

  it('bypass touch id and calls onAction with rejected', async () => {
    const onAction = jest.fn()
    const request = renderer.create(
      <Request {...defaultProps} onAction={onAction} />
    )
    const requestComponent = request.getInstance()
    // click title four times to disable touch id
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    requestComponent.onTitlePress()
    // click on accept button
    await requestComponent.onDecline()
    // check if passed onAction is called
    expect(onAction).toBeCalled()
    expect(onAction).toHaveBeenCalledWith('rejected')
  })

  it('TouchId and calls onAction if Allow/Deny button is pressed', async () => {
    const onAction = jest.fn()
    const request = renderer.create(
      <Request {...defaultProps} onAction={onAction} />
    )
    const requestComponent = request.getInstance()
    const touchIdAuth = await requestComponent.onAccept()
    await touchIdAuth
    expect(onAction).toBeCalled()
    expect(onAction).toHaveBeenCalledWith('accepted')
  })
})

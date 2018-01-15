/**
 * Intend to verify user actions
 * we will ask authorize user for some actions in app
 * either by asking for TouchId or asking user to enter pin code
 * we will ask for authorization while accepting invitation
 * accepting claim offer, sharing proof for now
 */
import React, { PureComponent } from 'react'
import LockEnter from './lock-enter'
import type { LockAuthorizationProps } from './type-lock'

export class LockAuthorization extends PureComponent<
  void,
  LockAuthorizationProps,
  void
> {
  onSuccess = () => {
    this.props.navigation.goBack()
    this.props.navigation.state.params.onSuccess()
  }

  onClose = () => {
    this.props.navigation.goBack()
    this.props.navigation.state.params.onFail()
  }

  render() {
    return <LockEnter onSuccess={this.onSuccess} />
  }
}

// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'

import { CustomText } from '../components'
import LockEnter from './lock-enter'
import { color, OFFSET_2X } from '../common/styles'
import { lockEnterPinRoute, lockPinSetupRoute } from '../common'
import type { ReactNavigation } from '../common/type-common'
import type { Store } from '../store/type-store'
import type { LockEnterPinProps, LockEnterPinState } from './type-lock'
import { clearPendingRedirect } from './lock-store'
import {
  ENTER_PASS_CODE_MESSAGE,
  ENTER_YOUR_PASS_CODE_MESSAGE,
} from '../common/message-constants'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import { UNLOCKING_APP_WAIT_MESSAGE } from '../common/message-constants'

export class LockEnterPin extends PureComponent<
  void,
  LockEnterPinProps,
  LockEnterPinState
> {
  state = {
    authenticationSuccess: false,
  }
  static navigationOptions = () => ({
    headerTitle: (
      <CustomText bg="tertiary" tertiary transparentBg semiBold>
        App Security
      </CustomText>
    ),
    headerStyle: tertiaryHeaderStyles.header,
  })

  componentWillReceiveProps(nextProps: LockEnterPinProps) {
    if (
      this.props.isFetchingInvitation !== nextProps.isFetchingInvitation &&
      nextProps.isFetchingInvitation === false &&
      nextProps.pendingRedirection
    ) {
      if (this.state.authenticationSuccess) {
        this.redirect()
      }
    }
  }

  redirect = () => {
    this.props.pendingRedirection.forEach(pendingRedirection => {
      setTimeout(() => {
        this.props.navigation.navigate(
          pendingRedirection.routeName,
          pendingRedirection.params
        )
      }, 0)
    })
    this.props.clearPendingRedirect()
  }

  onSuccess = () => {
    this.setState({ authenticationSuccess: true })
    // if we reach at this screen from settings page
    // then user is trying to enable/disable touch id
    if (this.props.existingPin) {
      this.props.navigation.navigate(lockPinSetupRoute, {
        existingPin: true,
      })
    } else if (
      this.props.pendingRedirection &&
      this.props.isFetchingInvitation === false
    ) {
      // user is trying to unlock the app
      // check if user has some pending action, so redirect to those
      this.redirect()
    }
  }

  render() {
    const { isFetchingInvitation } = this.props
    let message = this.props.existingPin
      ? ENTER_YOUR_PASS_CODE_MESSAGE
      : ENTER_PASS_CODE_MESSAGE
    if (isFetchingInvitation && this.state.authenticationSuccess) {
      message = UNLOCKING_APP_WAIT_MESSAGE
    }
    return <LockEnter onSuccess={this.onSuccess} message={message} />
  }
}

const mapStateToProps = (state: Store, { navigation }: ReactNavigation) => ({
  pendingRedirection: state.lock.pendingRedirection,
  isFetchingInvitation: Object.keys(state.smsPendingInvitation).some(
    smsToken =>
      state.smsPendingInvitation[smsToken] &&
      state.smsPendingInvitation[smsToken].isFetching === true
  ),
  existingPin: navigation.state
    ? navigation.state.params ? navigation.state.params.existingPin : false
    : false,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPendingRedirect,
    },
    dispatch
  )

export default StackNavigator({
  [lockEnterPinRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(LockEnterPin),
  },
})

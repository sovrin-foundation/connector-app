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

export class LockEnterPin extends PureComponent<void, LockEnterPinProps, void> {
  static navigationOptions = () => ({
    headerTitle: (
      <CustomText bg="tertiary" tertiary transparentBg semiBold>
        App Security
      </CustomText>
    ),
    headerStyle: tertiaryHeaderStyles.header,
  })

  onSuccess = () => {
    // if we reach at this screen from settings page
    // then user is trying to enable/disable touch id
    if (this.props.existingPin) {
      this.props.navigation.navigate(lockPinSetupRoute, {
        existingPin: true,
      })
    } else if (this.props.pendingRedirection) {
      // user is trying to unlock the app
      // check if user has some pending action, so redirect to those
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
  }

  render() {
    const message = this.props.existingPin
      ? ENTER_YOUR_PASS_CODE_MESSAGE
      : ENTER_PASS_CODE_MESSAGE

    return <LockEnter onSuccess={this.onSuccess} message={message} />
  }
}

const mapStateToProps = (state: Store, { navigation }: ReactNavigation) => ({
  pendingRedirection: state.lock.pendingRedirection,
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

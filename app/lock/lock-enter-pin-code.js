// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStackNavigator } from 'react-navigation'
import { safeGet, safeSet } from '../services/storage'
import LockEnter from './lock-enter'
import {
  lockEnterPinRoute,
  lockPinSetupRoute,
  homeRoute,
  lockSelectionRoute,
} from '../common'
import type { ReactNavigation } from '../common/type-common'
import type { Store } from '../store/type-store'
import type { LockEnterPinProps, LockEnterPinState } from './type-lock'
import { clearPendingRedirect } from './lock-store'
import {
  ENTER_PASS_CODE_MESSAGE,
  ENTER_YOUR_PASS_CODE_MESSAGE,
} from '../common/message-constants'
import { color } from '../common/styles'
import { UNLOCKING_APP_WAIT_MESSAGE } from '../common/message-constants'
import { unlockApp } from './lock-store'
import { CustomText, CustomHeader } from '../components'
import { Keyboard, Platform } from 'react-native'

export class LockEnterPin extends PureComponent<
  LockEnterPinProps,
  LockEnterPinState
> {
  state = {
    authenticationSuccess: false,
    isKeyboardHidden: false,
    showCustomKeyboard: false,
  }

  keyboardListener = null
  keyboardShowListener = null

  static navigationOptions = ({ navigation }) => ({
    header:
      navigation.state.params &&
      navigation.state.params.fromScreen === 'recovery' ? (
        <CustomHeader flatHeader backgroundColor={color.bg.tertiary.color} />
      ) : (
        <CustomHeader
          flatHeader
          backgroundColor={color.bg.tertiary.color}
          centerComponent={
            <CustomText bg="tertiary" tertiary transparentBg semiBold>
              App Security
            </CustomText>
          }
        />
      ),
  })

  componentDidMount() {
    this.keyboardListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardHideState
    )
    this.keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardShowState
    )
  }

  keyboardShowState = (event: any) => {
    if (event && event.endCoordinates.height < 100 && Platform.OS === 'ios') {
      this.setState({
        showCustomKeyboard: true,
      })
    } else {
      this.setState({
        showCustomKeyboard: false,
      })
    }
  }

  keyboardHideState = () => {
    this.setState({
      isKeyboardHidden: true,
    })

    if (
      this.state.authenticationSuccess &&
      this.props.currentScreen === lockEnterPinRoute
    ) {
      // if we reach at this screen from settings page
      // then user is trying to enable/disable touch id
      if (this.props.existingPin) {
        this.props.navigation.push(lockPinSetupRoute, {
          existingPin: true,
        })
      }
    }
  }

  componentWillReceiveProps(nextProps: LockEnterPinProps) {
    if (
      this.props.isFetchingInvitation !== nextProps.isFetchingInvitation &&
      nextProps.isFetchingInvitation === false &&
      nextProps.pendingRedirection
    ) {
      if (this.state.authenticationSuccess && this.state.isKeyboardHidden) {
        // passing the nextProps in to the redirect function
        // the prop is being changed (pendingRedirection) from object to null
        // CLEAR_PENDING_REDIRECT clearing the pendingRedirection property to null
        // so, the previous props are being sent for the redirection
        this.redirect(nextProps)
      }
    }

    // we are removing the keyboard listener every time we navigate out of this screen.
    if (nextProps.navigation.isFocused()) {
      if (!this.keyboardListener) {
        this.keyboardListener = Keyboard.addListener(
          'keyboardDidHide',
          this.keyboardHideState
        )
      }
      if (!this.keyboardShowListener) {
        this.keyboardShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this.keyboardShowState
        )
      }
    } else if (
      this.props.currentScreen === lockEnterPinRoute &&
      nextProps.currentScreen !== lockEnterPinRoute
    ) {
      this.keyboardListener && this.keyboardListener.remove()
      this.keyboardShowListener && this.keyboardShowListener.remove()
    }
  }

  // passing the props in to the function
  redirect = (props: LockEnterPinProps) => {
    props.unlockApp()
    if (props.pendingRedirection) {
      props.pendingRedirection.map(pendingRedirection => {
        props.navigation.navigate(
          pendingRedirection.routeName,
          pendingRedirection.params
        )
      })
      props.clearPendingRedirect()
    } else if (props.isAppLocked === true) {
      // * if app is unlocked and invitation is fetched , with out this condition we are redirecting user to home screen from invitation screen.
      // * this condition will avoid redirecting user to home screen if app is already unlocked
      setTimeout(() => {
        props.navigation.navigate(homeRoute)
      }, 0)
    }
  }

  onSuccess = () => {
    if (!this.state.authenticationSuccess) {
      this.setState({ authenticationSuccess: true })
      // if we reach at this screen from settings page
      // then user is trying to enable/disable touch id
      if (
        !this.props.existingPin &&
        this.props.isFetchingInvitation === false
      ) {
        // user is trying to unlock the app
        // check if user has some pending action, so redirect to those
        this.redirect(this.props)
      }
    }
  }

  redirectToSetupPasscode = () => {
    this.props.navigation.navigate(lockSelectionRoute)
  }

  render() {
    const { isFetchingInvitation, navigation, inRecovery } = this.props
    let fromRecovery = false
    if (navigation.state) {
      fromRecovery =
        (navigation.state.params &&
        navigation.state.params.fromScreen === 'recovery'
          ? true
          : false) || inRecovery === 'true'
    }
    let message = this.props.existingPin
      ? ENTER_YOUR_PASS_CODE_MESSAGE
      : ENTER_PASS_CODE_MESSAGE

    if (isFetchingInvitation && this.state.authenticationSuccess) {
      message = UNLOCKING_APP_WAIT_MESSAGE
    }

    return (
      <LockEnter
        fromRecovery={fromRecovery}
        onSuccess={this.onSuccess}
        message={message}
        setupNewPassCode={this.redirectToSetupPasscode}
        enableCustomKeyboard={this.state.showCustomKeyboard}
      />
    )
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
  isAppLocked: state.lock.isAppLocked,
  inRecovery: state.lock.inRecovery,
  currentScreen: state.route.currentScreen,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPendingRedirect,
      unlockApp,
    },
    dispatch
  )

export default createStackNavigator({
  [lockEnterPinRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(LockEnterPin),
  },
})

// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Container,
  CustomText,
  CustomView,
  CustomButton,
  Icon,
} from '../components'
import { settingsTabRoute } from '../common'
import { unlockApp, clearPendingRedirect } from './lock-store'
import type { Store } from '../store/type-store'
import { OFFSET_1X, OFFSET_2X, OFFSET_4X, color } from '../common/styles'
import { UNLOCKING_APP_WAIT_MESSAGE } from '../common/message-constants'

// TODO:KS define type of props for this component
export class LockSetupSuccess extends PureComponent {
  onClose = () => {
    this.props.unlockApp()
    if (
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.changePin === true
    ) {
      this.props.navigation.navigate(settingsTabRoute)
    } else if (this.props.pendingRedirection) {
      // if there is a redirection pending, then redirect and clear it
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
    const { isFetchingInvitation } = this.props
    let message =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.changePin === true
        ? 'Your connect.me app is secured.'
        : 'Your connect.me app is now secured'

    if (isFetchingInvitation === true) {
      message = UNLOCKING_APP_WAIT_MESSAGE
    }

    return (
      <Container tertiary>
        <Container clearBg center style={[style.successContainer]}>
          <Icon
            extraLarge
            resizeMode="cover"
            src={require('../images/lock.png')}
            testID="lock-success-lock-logo"
          />
          <CustomText
            h4
            bg="tertiary"
            tertiary
            thick
            center
            style={[style.successMessage]}
          >
            {message}
          </CustomText>
          <CustomText
            h6
            bg="tertiary"
            tertiary
            thick
            center
            style={[style.successMessage]}
          >
            {this.props.navigation.state.params &&
            this.props.navigation.state.params.changePin
              ? "From now on you'll need to use your pass code to unlock this app."
              : ' '}
          </CustomText>
        </Container>
        <CustomView>
          <CustomButton
            tertiary
            raised
            medium
            disabled={isFetchingInvitation}
            testID="close-button"
            fontWeight="600"
            title="Close"
            onPress={this.onClose}
          />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store, props) => ({
  pendingRedirection: state.lock.pendingRedirection,
  pendingRedirectionParams: state.lock.pendingRedirectionParams || {},
  isFetchingInvitation: state.smsPendingInvitation.isFetching,
  changePin:
    props.navigation.state.params !== undefined
      ? props.navigation.state.params.changePin
      : false,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPendingRedirect,
      unlockApp,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(LockSetupSuccess)

const style = StyleSheet.create({
  successContainer: {
    paddingHorizontal: OFFSET_2X,
  },
  successMessage: {
    paddingVertical: OFFSET_4X,
  },
  successInfo: {
    paddingHorizontal: OFFSET_1X,
  },
})

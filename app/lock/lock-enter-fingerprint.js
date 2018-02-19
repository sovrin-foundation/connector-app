//@flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { TouchId } from '../components/touch-id/touch-id'
import { Container, CustomText } from '../components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { captureError } from '../services/error/error-handler'
import { homeRoute } from '../common'
import { unlockApp } from './lock-store'
import { clearPendingRedirect } from '../store'
import type { Store } from '../store/type-store'
import { UNLOCKING_APP_WAIT_MESSAGE } from '../common/message-constants'
import type {
  LockEnterFingerProps,
  LockEnterFingerState,
  PendingRedirection,
} from './type-lock'

export class LockEnterFingerprint extends PureComponent<
  LockEnterFingerProps,
  LockEnterFingerState
> {
  state = {
    authenticationSuccess: false,
  }

  componentWillReceiveProps(nextProps: LockEnterFingerProps) {
    //if fetching Invitation prop has changed and its fetched then only check for authentication
    if (
      this.props.isFetchingInvitation !== nextProps.isFetchingInvitation &&
      nextProps.isFetchingInvitation === false
    ) {
      if (this.state.authenticationSuccess) {
        this.onAuthenticationSuccess(nextProps.pendingRedirection)
      }
    }
  }

  onAuthenticationSuccess = (pendingRedirection: Array<PendingRedirection>) => {
    this.props.unlockApp()
    if (pendingRedirection) {
      pendingRedirection.forEach(pendingRedirection => {
        setTimeout(() => {
          this.props.navigation.navigate(
            pendingRedirection.routeName,
            pendingRedirection.params
          )
        }, 0)
      })
      this.props.clearPendingRedirect()
    } else {
      this.props.navigation.navigate(homeRoute)
    }
  }

  touchIdHandler = () => {
    TouchId.authenticate('', this.touchIdHandler)
      .then(success => {
        this.setState({ authenticationSuccess: true })
        if (this.props.isFetchingInvitation === false) {
          this.onAuthenticationSuccess(this.props.pendingRedirection)
        }
      })
      .catch(error => {
        captureError(error)
        // not sure what to do if finger print authentication failed
      })
  }

  componentDidMount() {
    this.touchIdHandler()
  }

  render() {
    const { isFetchingInvitation } = this.props
    const message = isFetchingInvitation ? UNLOCKING_APP_WAIT_MESSAGE : ''

    if (isFetchingInvitation) {
      return (
        <Container center>
          <CustomText bg="tertiary" h5 tertiary demiBold center transparentBg>
            {message}
          </CustomText>
        </Container>
      )
    } else {
      return <Container />
    }
  }
}

const mapStateToProps = (state: Store) => ({
  pendingRedirection: state.lock.pendingRedirection,
  pendingRedirectionParams: state.lock.pendingRedirectionParams || {},
  isFetchingInvitation: Object.keys(state.smsPendingInvitation).some(
    smsToken =>
      state.smsPendingInvitation[smsToken] &&
      state.smsPendingInvitation[smsToken].isFetching === true
  ),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPendingRedirect,
      unlockApp,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(
  LockEnterFingerprint
)

// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomText, CustomView, CustomButton } from '../components'
import { homeRoute } from '../common'
import { unlockApp, clearPendingRedirect } from './lock-store'
import type { Store } from '../store/type-store'

export class LockSetupSuccess extends PureComponent {
  onClose = () => {
    this.props.unlockApp()
    if (this.props.pendingRedirection) {
      // if there is a redirection pending, then redirect and clear it
      this.props.navigation.navigate(this.props.pendingRedirection)
      this.props.clearPendingRedirect()
    }
  }

  render() {
    return (
      <Container>
        <Container primary>
          <CustomText h2>Your connect.me app is secured.</CustomText>
          <CustomText>
            From now on you'll need to use your PIN to unlock this app.
          </CustomText>
        </Container>
        <CustomView>
          <CustomButton primary title="Close" onPress={this.onClose} />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  pendingRedirection: state.lock.pendingRedirection,
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

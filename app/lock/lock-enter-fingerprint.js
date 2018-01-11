//@flow
import React, { PureComponent } from 'react'
import { TouchId } from '../components/touch-id/touch-id'
import { Container } from '../components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { captureError } from '../services/error/error-handler'
import { homeRoute } from '../common'
import { clearPendingRedirect } from '../store'
import type { Store } from '../store/type-store'
export class LockEnterFingerprint extends PureComponent {
  touchIdHandler = () => {
    TouchId.authenticate('', this.touchIdHandler)
      .then(success => {
        if (this.props.pendingRedirection) {
          this.props.pendingRedirection.forEach(pendingRedirection => {
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
    return <Container />
  }
}

const mapStateToProps = (state: Store) => ({
  pendingRedirection: state.lock.pendingRedirection,
  pendingRedirectionParams: state.lock.pendingRedirectionParams || {},
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPendingRedirect,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(
  LockEnterFingerprint
)

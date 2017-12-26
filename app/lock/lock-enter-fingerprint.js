//@flow
import React, { PureComponent } from 'react'
import TouchID from 'react-native-touch-id'
import { Container } from '../components'
import { connect } from 'react-redux'
import { captureError } from '../services/error/error-handler'
import { lockEnterPinRoute } from '../common'

export class LockEnterFingerprint extends PureComponent {
  touchIdHandler = () => {
    TouchID.authenticate('')
      .then(success => this.props.navigation.navigate(lockEnterPinRoute))
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

export default connect(null, null)(LockEnterFingerprint)
